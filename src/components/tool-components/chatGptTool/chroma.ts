import {ChromaClient} from 'chromadb'

const client = new ChromaClient();

let collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: null,
});