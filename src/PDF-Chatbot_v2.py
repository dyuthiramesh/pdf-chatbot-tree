import streamlit as st
from PyPDF2 import PdfReader
# from streamlit_extras.add_vertical_space import add_vertical_space
from langchain.vectorstores.chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import os
from langchain.prompts import ChatPromptTemplate


 
os.environ['OPENAI_API_KEY'] ="Enter your API"
CHROMA_PATH = "chroma"
 
PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def main():
    st.header("Chat with PDF 💬")

    # upload a PDF file
    pdf = st.file_uploader("Upload your PDF", type='pdf')
 
    # st.write(pdf)
    if pdf is not None:
        pdf_reader = PdfReader(pdf)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
 
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
            )
        chunks = text_splitter.split_text(text=text)
 
        # # embeddings
        store_name = pdf.name[:-4]
        st.write(f'{store_name}')
 
        embeddings = OpenAIEmbeddings()
        VectorStore = Chroma.from_texts(chunks,embeddings)
        # VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
 
        # Accept user questions/query
        query = st.text_input("Ask questions about your PDF file:")
        # st.write(query)
 
        if query:
            # docs = VectorStore.similarity_search(query=query, k=3)
            score = VectorStore.similarity_search_with_relevance_scores(query=query, k=3)
            if len(score) == 0 or score[0][1] < 0.7:
                st.write("Unable to find matching results.")
                
            else:
                context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in score])
                prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
                prompt = prompt_template.format(context=context_text, question=query)
                print(prompt)
                llm = OpenAI()
                response = llm.predict(prompt)
                st.write(response)
 
if __name__ == '__main__':
    main()