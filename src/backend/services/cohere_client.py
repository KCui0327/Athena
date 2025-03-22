import os
import cohere
import dotenv
dotenv.load_dotenv()

class Cohere:
    def __init__(self, api_key:str):
        self.co = cohere.Client(api_key)

    def create_dataset(self, dataset_id:str):
        ds = self.co.datasets.create(
            name=dataset_id,
            data=open("./transcript.jsonl", "rb"),
            keep_fields=["chunk_id","text","video_id", "start_time", "end_time"],
            type="embed-input",
        )
        return ds
    
    def embed(self, texts:list[str], model:str="embed-english-v3.0", input_type:str="search_document", embedding_types:list[str]=["float"]):
        response = self.co.embed(
            texts=texts,
            model=model,
            input_type=input_type,
            embedding_types=embedding_types,
        )
        return response
    
    def embed_job(self, dataset_id:str, model:str="embed-english-v3.0", input_type:str="search_document", embedding_types:list[str]=["float"]):
        job = self.co.embed_jobs.create(
            dataset_id=dataset_id, input_type=input_type, model=model
        )
        return job
    
if __name__ == "__main__":
    co = Cohere(os.getenv('COHERE_API_KEY'))
    print(co.embed(["hello", "goodbye"]))


