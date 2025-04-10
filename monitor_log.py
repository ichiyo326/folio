#!/usr/bin/env python3

import os
import re
import requests

class LogMonitor:
    def __init__(self,
                 log_file_path: str,
                 offset_file_path: str,
                 slack_webhook_url: str,
                 pattern: str) -> None:
        self.log_file_path = log_file_path
        self.offset_file_path = offset_file_path
        self.slack_webhook_url = slack_webhook_url
        self.pattern = re.compile(pattern)
        self.offset = 0

    def read_offset(self) -> None:
        if not os.path.exists(self.offset_file_path):
            self.offset = 0
            return
        with open(self.offset_file_path, "r") as f:
            offset_str = f.read().strip()
            if offset_str.isdigit():
                self.offset = int(offset_str)
            else:
                self.offset = 0

    def save_offset(self, new_offset: int) -> None:
        with open(self.offset_file_path, "w") as f:
            f.write(str(new_offset))

    def send_slack_notification(self, message: str) -> None:
        payload = {"text": message}
        requests.post(self.slack_webhook_url, json=payload)

    def monitor(self) -> None:
        if not os.path.exists(self.log_file_path):
            return

        new_offset = self.offset
        with open(self.log_file_path, "r", encoding="utf-8", errors="replace") as log_file:
            log_file.seek(self.offset)
            for line in log_file:
                encoded_line = line.encode("utf-8", errors="replace")
                new_offset += len(encoded_line)
                if self.pattern.search(line):
                    alert_msg = f"[ALERT] {self.log_file_path}: {line.strip()}"
                    self.send_slack_notification(alert_msg)

        self.save_offset(new_offset)

def main() -> None:
    LOG_FILE_PATH = "/var/log/deviceA.log"
    OFFSET_FILE_PATH = "/home/user/deviceA_offset.dat"
    SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/XXXXX/XXXXX/XXXXXX"
    PATTERN = r"(ERROR|CRITICAL|FAIL)"

    monitor = LogMonitor(
        log_file_path=LOG_FILE_PATH,
        offset_file_path=OFFSET_FILE_PATH,
        slack_webhook_url=SLACK_WEBHOOK_URL,
        pattern=PATTERN
    )

    monitor.read_offset()
    monitor.monitor()

if __name__ == "__main__":
    main()
