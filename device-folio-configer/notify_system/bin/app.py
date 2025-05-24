#!/usr/bin/env python3
import argparse
import concurrent.futures as futures
import logging
import os
import smtplib
import time
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import List

import yaml
from device_monitor import DeviceMonitor


def load_yaml(path: Path) -> dict:
    try:
        with path.open(encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data if isinstance(data, dict) else {}
    except yaml.YAMLError as e:
        logging.error("YAML parse error: %s : %s", path, e)
        return {}


def send_mail(host: str, port: int, frm: str, to: List[str], subj: str, body: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = subj
    msg["From"] = frm
    msg["To"] = ", ".join(to)
    msg.set_content(body)

    for retry in range(3):
        try:
            with smtplib.SMTP(host, port, timeout=10) as smtp:
                smtp.send_message(msg)
            logging.info("Mail sent: %s", subj)
            return
        except (smtplib.SMTPException, OSError) as e:
            logging.warning("SMTP retry %d / %s : %s", retry + 1, subj, e)
            time.sleep(2)
    logging.error("Mail failed: %s", subj)


def run_monitor(m: DeviceMonitor, host: str, port: int, frm: str, to: List[str]) -> None:
    matched = m.monitor_log()
    if not matched:
        return
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    subject = f"[Notify] {m.device_name} Log Update"
    body = f"Device: {m.device_name}\nTimestamp: {ts}\n" + "\n".join(matched)
    send_mail(host, port, frm, to, subject, body)


def build_monitors(cfg_dir: Path) -> List[DeviceMonitor]:
    monitors: List[DeviceMonitor] = []
    for yml in cfg_dir.glob("*.yml"):
        cfg = load_yaml(yml)
        if not cfg:
            continue

        # YAML 内の相対パスを config-dir 基準に展開
        def _resolve(p: str | None) -> str:
            if not p or os.path.isabs(p):
                return p or ""
            return str((cfg_dir / p).resolve())

        mon = DeviceMonitor(
            device_name=cfg.get("device_name", yml.stem),
            log_file_path=_resolve(cfg.get("log_file_path")),
            offset_file_path=_resolve(cfg.get("offset_file_path")),
            pattern_str=cfg.get("pattern", ""),
            pid_file_path=_resolve(cfg.get("pid_file_path")),
            collect_resource=cfg.get("collect_resource", False),
        )
        mon.read_offset()
        monitors.append(mon)
    return monitors


def parse_args() -> argparse.Namespace:
    default_cfg_dir = Path(__file__).resolve().parent.parent / "config"
    p = argparse.ArgumentParser()
    p.add_argument("--config-dir", default=os.getenv("NS_CFG_DIR", default_cfg_dir))
    p.add_argument("--mail-host", default=os.getenv("NS_MAIL_HOST", "localhost"))
    p.add_argument("--mail-port", type=int, default=int(os.getenv("NS_MAIL_PORT", "25")))
    p.add_argument("--from-addr", default=os.getenv("NS_FROM", "lab-notice@internal.edu"))
    p.add_argument("--to-addrs", default=os.getenv("NS_TO", "member1@internal.edu,member2@internal.edu"))
    p.add_argument("--log-level", default="INFO", choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    return p.parse_args()


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=getattr(logging, args.log_level),
                        format="%(asctime)s %(levelname)s %(message)s")

    cfg_dir = Path(args.config_dir)
    if not cfg_dir.exists():
        logging.error("Config directory not found: %s", cfg_dir)
        return

    monitors = build_monitors(cfg_dir)
    if not monitors:
        logging.error("No monitors loaded from %s", cfg_dir)
        return

    with futures.ThreadPoolExecutor(max_workers=len(monitors)) as pool:
        for m in monitors:
            pool.submit(
                run_monitor,
                m,
                args.mail_host,
                args.mail_port,
                args.from_addr,
                [addr.strip() for addr in args.to_addrs.split(",")],
            )


if __name__ == "__main__":
    main()
