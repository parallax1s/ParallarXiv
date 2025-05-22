import pathlib
import unittest

class TestIndexHtml(unittest.TestCase):
    def test_deployment_header(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        content = (root / "index.html").read_text()
        self.assertIn("<h1>Deployment OK</h1>", content)

if __name__ == "__main__":
    unittest.main()
