#!/usr/bin/env python3

import os
import re
import smtplib
from email.message import EmailMessage
from typing import List


class DeviceMonitor:
    def __init__(
        self,
        device_name: str,
        log_file_path: str,
        offset_file_path: str,
        pattern_str: str,
    ) -> None:
        self.device_name = device_name
        self.log_file_path = log_file_path
        self.offset_file_path = offset_file_path
        self.pattern = re.compile(pattern_str)
        self.offset = 0

    def read_offset(self) -> None:
        if not os.path.exists(self.offset_file_path):
            self.offset = 0
            print(f"[DEBUG] Offset file not found. device={self.device_name}")
            return
        with open(self.offset_file_path, "r") as f:
            offset_str = f.read().strip()
            if offset_str.isdigit():
                self.offset = int(offset_str)
            else:
                self.offset = 0
        print(f"[DEBUG] Read offset={self.offset}, device={self.device_name}")

    def save_offset(self, new_offset: int) -> None:
        with open(self.offset_file_path, "w") as f:
            f.write(str(new_offset))
        print(f"[DEBUG] Saved offset={new_offset}, device={self.device_name}")

    def monitor_log(self) -> List[str]:
        if not os.path.exists(self.log_file_path):
            print(f"[DEBUG] Log file not found. path={self.log_file_path}")
            return []

        matched_lines = []
        new_offset = self.offset

        with open(self.log_file_path, "r", encoding="utf-8", errors="replace") as log_file:
            log_file.seek(self.offset)
            for line in log_file:
                line_encoded = line.encode("utf-8", errors="replace")
                new_offset += len(line_encoded)
                if self.pattern.search(line):
                    matched_lines.append(line.strip())

        self.save_offset(new_offset)
        return matched_lines


class MailNotifier:
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
