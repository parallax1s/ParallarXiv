import argparse
import json
import tarfile
from typing import Iterator, Dict, Any


def iter_arxiv_records(tar_path: str) -> Iterator[Dict[str, Any]]:
    """Yield records from a compressed arXiv metadata dump.

    The dump is expected to be a tar.xz archive containing a single
    ``arXiv-metadata-oai-snapshot.json`` file with one JSON object per
    line. Records are yielded lazily so the file can be processed
    without loading everything into memory.
    """
    with tarfile.open(tar_path, mode="r:xz") as tar:
        member = tar.extractfile("arXiv-metadata-oai-snapshot.json")
        if member is None:
            raise FileNotFoundError(
                "arXiv-metadata-oai-snapshot.json not found in archive"
            )
        for line in member:
            yield json.loads(line)


def main() -> None:
    parser = argparse.ArgumentParser(description="Iterate arXiv metadata dump")
    parser.add_argument("tar_path", help="Path to arXiv-metadata-dump tar.xz file")
    parser.add_argument(
        "--limit", type=int, default=5, help="Number of records to print"
    )
    args = parser.parse_args()

    for idx, record in enumerate(iter_arxiv_records(args.tar_path)):
        print(record.get("id"), record.get("title"))
        if idx + 1 >= args.limit:
            break


if __name__ == "__main__":
    main()
