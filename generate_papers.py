import json
import random
from pathlib import Path


TOPICS = [
    "physics",
    "biology",
    "chemistry",
    "mathematics",
    "computer_science",
    "earth_science",
    "astronomy",
    "medicine",
    "engineering",
    "environmental_science",
    "psychology",
    "economics",
    "sociology",
    "materials_science",
    "biophysics",
]


def build_topic_hierarchy():
    topics = {}
    for topic in TOPICS:
        if topic == "biophysics":
            topics[topic] = {
                "associations": ["biology", "physics"],
                "categories": {
                    "optogenetics": ["photoreceptor_design", "neural_modulation"],
                    "neurobiophysics": ["membrane_ion_channels", "synaptic_mechanics"],
                },
            }
        else:
            categories = {}
            for i in range(1, 4):
                cat_name = f"{topic}_cat{i}"
                subcats = [f"{cat_name}_sub{j}" for j in range(1, 3)]
                categories[cat_name] = subcats
            other_topics = [t for t in TOPICS if t != topic]
            associations = random.sample(other_topics, 2)
            topics[topic] = {"associations": associations, "categories": categories}
    return topics


def generate_papers(num_papers=5000):
    topics = build_topic_hierarchy()
    papers = []
    topic_ids = {t: [] for t in topics}

    for pid in range(1, num_papers + 1):
        topic = random.choice(list(topics.keys()))
        category = random.choice(list(topics[topic]["categories"].keys()))
        subcategory = random.choice(topics[topic]["categories"][category])
        paper = {
            "id": pid,
            "title": str(pid),
            "topic": topic,
            "category": category,
            "subcategory": subcategory,
            "citations": [],
        }
        papers.append(paper)
        topic_ids[topic].append(pid)

    all_ids = list(range(1, num_papers + 1))
    for paper in papers:
        num_cites = random.randint(10, 20)
        same_num = random.randint(int(num_cites * 0.6), num_cites)
        other_num = num_cites - same_num

        same_pool = [i for i in topic_ids[paper["topic"]] if i != paper["id"]]
        other_pool = [i for i in all_ids if i not in same_pool and i != paper["id"]]

        cites = []
        if same_pool:
            cites.extend(random.sample(same_pool, min(len(same_pool), same_num)))
        if other_pool:
            cites.extend(random.sample(other_pool, min(len(other_pool), other_num)))

        paper["citations"] = cites

    inbound = {pid: 0 for pid in all_ids}
    for paper in papers:
        for cid in paper["citations"]:
            inbound[cid] += 1

    for paper in papers:
        paper["citation_count"] = inbound[paper["id"]] * random.uniform(1.0, 4.0)

    return {"topics": topics, "papers": papers}


def main():
    data = generate_papers()
    out = Path(__file__).resolve().parent / "public" / "papers.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(data))
    print(f"Generated {len(data['papers'])} papers to {out}")


if __name__ == "__main__":
    main()
