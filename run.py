import SimpleHTTPServer, SocketServer
import urlparse, os

PORT = 3000

class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsedParams = urlparse.urlparse(self.path)
        if os.access('.' + os.sep + parsedParams.path, os.R_OK):
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self);
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            with open('index.html', 'r') as fin:
                self.copyfile(fin, self.wfile)

Handler = MyHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
print "Serving at port", PORT
httpd.serve_forever()