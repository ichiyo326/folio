#!/usr/bin/env python3
import os
import yaml  # PyYAML
from typing import List
from device_monitor import DeviceMonitor, MailNotifier

def load_yaml_config(config_path: str) -> dict:
    if not os.path.exists(config_path):
        print(f"[DEBUG] YAML config not found: {config_path}")
        return {}
    with open(config_path, "r") as f:
        data = yaml.safe_load(f)
    return data if isinstance(data, dict) else {}

def main() -> None:
    # 学内メールサーバ設定例
    MAIL_HOST = "localhost"
    MAIL_PORT = 25
    FROM_ADDR = "lab-notice@internal.edu"
    TO_ADDRS = ["member1@internal.edu", "member2@internal.edu"]

    # configフォルダ内のYAMLファイル一覧 (装置A, B, MATLAB実験)
    config_files = [
        "/usr/local/bin/notify_system/config/deviceA.yml",
        "/usr/local/bin/notify_system/config/deviceB.yml",
        "/usr/local/bin/notify_system/config/deviceMatlab.yml",
    ]

    monitors = []
    for cfg_path in config_files:
        cfg = load_yaml_config(cfg_path)
        if not cfg:
            continue
        # デバイスごとにMonitorインスタンス化
        monitor = DeviceMonitor(
            device_name=cfg.get("device_name", "UnknownDevice"),
            log_file_path=cfg.get("log_file_path", ""),
            offset_file_path=cfg.get("offset_file_path", ""),
            pattern_str=cfg.get("pattern", ""),
        )
        monitor.read_offset()
        monitors.append(monitor)

    # メール通知用のインスタンス
    mail_notifier = MailNotifier(
        mail_host=MAIL_HOST,
        mail_port=MAIL_PORT,
        from_addr=FROM_ADDR,
        to_addrs=TO_ADDRS
    )

    # 監視処理・メール送信
    for monitor in monitors:
        matched_lines = monitor.monitor_log()
        if matched_lines:
            subject = f"[Notify] {monitor.device_name} Log Update"
            body = (
                f"Device: {monitor.device_name}\n"
                f"Matched Lines:\n" + "\n".join(matched_lines)
            )
            mail_notifier.send_mail(subject, body)

if __name__ == "__main__":
    main()
