import sys
import time
import math
import re
import difflib
import collections
import json
import random

from datetime import datetime

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse
from page import *

from pathlib import Path


def start():

    class MyHTTPRequestHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            normal_paths = {
            '/': {'status': 200},
            '/favicon.ico': {'status': 202},  # Need for chrome
            }
            que_path = '/?page='
            if not self.path.startswith(que_path) and not self.path in normal_paths:
                response = 500
                self.send_response(response)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                content = WEB_HTML.format(STYLE_SHEET, CSS, FONT_AWESOME, JS)
                self.wfile.write(bytes(content, 'UTF-8'))

            elif self.path in normal_paths:
                response = normal_paths[self.path]['status']
                print('path = {}'.format(self.path))

                parsed_path = urlparse(self.path)
                print('parsed: path = {}, query = {}'.format(parsed_path.path, parse_qs(parsed_path.query)))

                print('headers\r\n-----\r\n{}-----'.format(self.headers))

                self.send_response(response)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                content = WEB_HTML.format(STYLE_SHEET, CSS, FONT_AWESOME, JS)
                self.wfile.write(bytes(content, 'UTF-8'))

            else:
                response = 200
                print('path = {}'.format(self.path))

                parsed_path = urlparse(self.path)
                print('parsed: path = {}, query = {}'.format(parsed_path.path, parse_qs(parsed_path.query)))

                print('headers\r\n-----\r\n{}-----'.format(self.headers))

                self.send_response(response)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                content = WEB_HTML.format(STYLE_SHEET, CSS, FONT_AWESOME, JS)
                self.wfile.write(bytes(content, 'UTF-8'))

        def do_POST(self):
            """
            Handle POST request, especially replying to a chat message.
            """
            print('path = {}'.format(self.path))
            parsed_path = urlparse(self.path)
            print('parsed: path = {}, query = {}'.format(parsed_path.path, parse_qs(parsed_path.query)))

            print('headers\r\n-----\r\n{}-----'.format(self.headers))

            if self.path == '/start':
                content_length = int(self.headers['content-length'])
                try:
                    content = self.rfile.read(content_length).decode('utf-8')
                    print('body = {}'.format(content))

                    body = json.loads(content)

                    did = body["id"]
                    with open(f"../data/{did}.json", "r") as t:
                        dialogues = json.loads(t.read())

                    response = dialogues
                except Exception as e:
                    print("error", e, flush=True)
                    response = {"text": f"server error!!! 入力形式に誤りがあります。error Message: {e}"}
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                json_str = json.dumps(response)
                self.wfile.write(bytes(json_str, 'utf-8'))
            
            elif self.path == '/end':
                content_length = int(self.headers['content-length'])
                try:
                    content = self.rfile.read(content_length).decode('utf-8')
                    print('body = {}'.format(content))

                    body = json.loads(content)

                    uname = body["name"]
                    did = body["id"]
                    Path(f"../log/{did}").mkdir(parents=True, exist_ok=True)
                    with open(f"../log/{did}/{uname}.json", "w") as t:
                        print(body, file=t)

                    model_response = {"text": "ok"}
                except Exception as e:
                    print("error", e, flush=True)
                    model_response = {"text": f"server error!!! 入力形式に誤りがあります。error Message: {e}"}
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                json_str = json.dumps(model_response)
                self.wfile.write(bytes(json_str, 'utf-8'))

        
    print("Start", flush=True)
    address = ('localhost', 8080)

    MyHTTPRequestHandler.protocol_version = 'HTTP/1.0'
    with HTTPServer(address, MyHTTPRequestHandler) as server:
        server.serve_forever()


def main():
    start()


if __name__ == "__main__":
    main()