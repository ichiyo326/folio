import os
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from typing import List, Optional

import psutil


class DeviceMonitor:
    """指定装置のログ監視とリソース統計取得を行う"""

    def __init__(
        self,
        device_name: str,
        log_file_path: str,
        offset_file_path: str,
        pattern_str: str,
        pid_file_path: Optional[str] = None,
        collect_resource: bool = False,
    ) -> None:
        self.device_name = device_name
        self.log_file_path = log_file_path
        self.offset_file_path = offset_file_path
        self.pattern = re.compile(pattern_str)
        self.pid_file_path = pid_file_path
        self.collect_resource = collect_resource
        self.offset = 0

    def read_offset(self) -> None:
        if not os.path.exists(self.offset_file_path):
            self.offset = 0
            print(f"[DEBUG] Offset file not found: {self.offset_file_path}")
            return
        with open(self.offset_file_path, "r") as f:
            offset_str = f.read().strip()
            self.offset = int(offset_str) if offset_str.isdigit() else 0
        print(f"[DEBUG] Read offset={self.offset}, device={self.device_name}")

    def save_offset(self, new_offset: int) -> None:
        with open(self.offset_file_path, "w") as f:
            f.write(str(new_offset))
        print(f"[DEBUG] Saved offset={new_offset}, device={self.device_name}")

    def _resource_line(self) -> str | None:
        if not (self.collect_resource and self.pid_file_path):
            return None
        if not os.path.exists(self.pid_file_path):
            return "[RES] pid_file_absent"
        try:
            with open(self.pid_file_path) as f:
                pid = int(f.read().strip())
        except (ValueError, OSError):
            return "[RES] pid_read_error"
        try:
            proc = psutil.Process(pid)
            cpu_sec = proc.cpu_times().user + proc.cpu_times().system
            rss = proc.memory_info().rss
            started = datetime.fromtimestamp(proc.create_time(), tz=timezone.utc)
            elapsed = (datetime.now(tz=timezone.utc) - started).total_seconds()
            return (
                f"[RES] pid={pid} cpu_sec={cpu_sec:.2f} "
                f"rss={rss} elapsed_sec={int(elapsed)}"
            )
        except psutil.NoSuchProcess:
            return "[RES] process_finished"
        except psutil.Error as exc:
            return f"[RES] psutil_error={exc}"

    def monitor_log(self) -> List[str]:
        if not os.path.exists(self.log_file_path):
            print(f"[WARN] Log file not found: {self.log_file_path}")
            return []

        matched: List[str] = []
        new_offset = self.offset

        with open(self.log_file_path, "r", encoding="utf-8", errors="replace") as log_file:
            log_file.seek(self.offset)
            for line in log_file:
                encoded = line.encode("utf-8", errors="replace")
                new_offset += len(encoded)
                if self.pattern.search(line):
                    matched.append(line.strip())

        res_line = self._resource_line()
        if res_line:
            matched.append(res_line)

        self.save_offset(new_offset)
        return matched


class MailNotifier:
    """SMTP によるメール送信ユーティリティ"""

    def __init__(
        self,
        mail_host: str,
        mail_port: int,
        from_addr: str,
        to_addrs: List[str],
    ) -> None:
        self.mail_host = mail_host
        self.mail_port = mail_port
        self.from_addr = from_addr
        self.to_addrs = to_addrs

    def send_mail(self, subject: str, body: str) -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self.from_addr
        msg["To"] = ", ".join(self.to_addrs)
        msg.set_content(body)

        print(f"[DEBUG] Sending mail subject={subject}, to={self.to_addrs}")
        with smtplib.SMTP(self.mail_host, self.mail_port) as smtp:
            smtp.send_message(msg)
        print("[DEBUG] Mail sent.")