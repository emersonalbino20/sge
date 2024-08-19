async function fetching (){
    const response = await fetch('http://localhost:8000/api/alunos?page_size=2');
    const result = await response.json()
    console.log(result)
}
fetching()