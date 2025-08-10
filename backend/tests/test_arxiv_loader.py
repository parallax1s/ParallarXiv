import json
import tarfile
from pathlib import Path

from app.arxiv_loader import iter_arxiv_records


def create_sample_dump(tmp_path: Path):
    data = [
        {"id": "1", "title": "First"},
        {"id": "2", "title": "Second"},
    ]
    json_content = "\n".join(json.dumps(r) for r in data).encode()
    json_file = tmp_path / "arXiv-metadata-oai-snapshot.json"
    json_file.write_bytes(json_content)
    tar_path = tmp_path / "sample.tar.xz"
    with tarfile.open(tar_path, "w:xz") as tar:
        tar.add(json_file, arcname="arXiv-metadata-oai-snapshot.json")
    return tar_path, data


def test_iter_arxiv_records(tmp_path: Path) -> None:
    tar_path, expected = create_sample_dump(tmp_path)
    records = list(iter_arxiv_records(str(tar_path)))
    assert records == expected
