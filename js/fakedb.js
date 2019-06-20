var dbIsabellaeLucasGusmao = {
    "dados": {
        "publicacoes": [
        ]
    }
}

// Caso exista no Local Storage, recupera os dados salvos
var db = JSON.parse(localStorage.getItem('dbIsabellaeLucasGusmao'));
if (!db) {
    localStorage.setItem("dbIsabellaeLucasGusmao", JSON.stringify(dbIsabellaeLucasGusmao));
    db = JSON.parse(localStorage.getItem('dbIsabellaeLucasGusmao'));
};

function insertCurtida(id) {
    db.dados.publicacoes.find(p => p.id == id).curtidas++;
    // Atualiza os dados no Local Storage
    localStorage.setItem('dbIsabellaeLucasGusmao', JSON.stringify(db));

    window.location.reload();
}

function insertPublicacao(publicacao) {
    // Calcula novo Id a partir do último código existente no array
    let novoId = dbIsabellaeLucasGusmao.dados.publicacoes[dbIsabellaeLucasGusmao.dados.publicacoes.length - 1].id + 1;
    let novaPublicacao = {
        "id": novoId,
        "autor": publicacao.autor,
        "titulo": publicacao.titulo,
        "texto": publicacao.texto,
        "dataDePublicacao": new Date(),
        "categoria": publicacao.categoria,
        "imagem": publicacao.imagem,
        "curtidas": 0
    };

    // Insere o novo objeto no array
    db.dados.publicacoes.push(novaPublicacao);

    // Atualiza os dados no Local Storage
    localStorage.setItem('dbIsabellaeLucasGusmao', JSON.stringify(db));
    listaPublicacoes();
}

function insertComentario(comentario, postId) {
    // Calcula novo Id a partir do último código existente no array
    let novoId = db.dados.publicacoes.find(p => p.id == postId).comentarios[db.dados.publicacoes.find(p => p.id == postId).comentarios.length - 1].id + 1;
    let novoComentario = {
        "id": novoId,
        "nome": comentario.nome,
        "texto": comentario.texto,
        "dataDePublicacao": new Date()
    };

    // Insere o novo objeto no array
    db.dados.publicacoes.find(p => p.id == postId).comentarios.push(novoComentario);

    // Atualiza os dados no Local Storage
    localStorage.setItem('dbIsabellaeLucasGusmao', JSON.stringify(db));

    window.location.reload();
}

function listaPublicacoes() {
    db = JSON.parse(localStorage.getItem('dbIsabellaeLucasGusmao'));

    document.querySelector('#postList').innerHTML = "";
    let texto = '';

    db.dados.publicacoes.forEach((post) => {
        texto += `
        <div  class="post">
        <img class="post-image" src="${post.imagem}"
            alt="${post.titulo}">
            <div class="post-content">
                <h1 class="post-title">${post.titulo}</h1>
                <div class="post-info">
                    <span class="post-author">${post.autor}</span>
                    <i>∙</i>
                    <strong class="post-category">${post.categoria}</strong>
                    <i>∙</i>
                    <time class="post-date">${post.dataDePublicacao}</time>
                </div>
            </div>
            <i data-id="${post.id}" class="post-overlay"></i>
            <button data-id="${post.id}" class="button post-like">${post.curtidas} ∙ Curtir</button>
        </div>
        `;
    });
    
    document.querySelector('#postList').innerHTML = texto;
}

function getBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
}

function closeModals() {
    const modals = document.querySelectorAll(".modal");

    modals.forEach(modal => {
        if (modal.classList.contains("is-visible")) {
            modal.classList.remove("is-visible");
        }
    });

    document.querySelector(".backdrop").classList.remove("is-visible");
}

listaPublicacoes();

document.querySelectorAll(".post").forEach(el => el.addEventListener("click", event => {
    if (event.target.classList.contains("post-like")) {
        return;
    }

    const id = event.target.dataset.id;

    document.querySelector(".backdrop").classList.add("is-visible");
    document.querySelector(".viewPost").classList.add("is-visible");

    document.querySelector(".viewPost-title").innerHTML = db.dados.publicacoes.find(post => post.id == id).titulo;
    document.querySelector(".viewPost-image").src = db.dados.publicacoes.find(post => post.id == id).imagem;
    document.querySelector(".viewPost-content").innerHTML = db.dados.publicacoes.find(post => post.id == id).texto;

    document.querySelector("#post-new-comment").dataset.id = id;

    document.querySelector(".viewPost-comments").innerHTML = db.dados.publicacoes.find(post => post.id == id).comentarios.map(comment => (
        `
        <div class="viewPost-comment">
            <span class="viewPost-comment-name">${comment.nome}</span>
            <p class="viewPost-comment-text">${comment.texto}</p>
            <time class="viewPost-comment-date">${comment.dataDePublicacao}</time>
        </div>
        `
    )).join("");
}));


document.querySelector(".backdrop").addEventListener("click", closeModals);

document.querySelector("#write-new-post").addEventListener("click", () => {
    document.querySelector(".newPost").classList.add("is-visible");
    document.querySelector(".backdrop").classList.add("is-visible");
});

document.querySelector("#create-new-post").addEventListener("click", () => {
    const author = document.querySelector("#author").value;
    const title = document.querySelector("#title").value;
    const category = document.querySelector("#category").value;
    const text = document.querySelector("#text");
    getBase64(document.querySelector("#image").files[0], (base64 => {
        debugger;
        insertPublicacao({
            "autor": author,
            "titulo": title,
            "texto": text,
            "categoria": category,
            "imagem": base64,
        });
    }));

    closeModals();
});

document.querySelectorAll(".post-like").forEach(el => el.addEventListener("click", event => {
    const id = event.target.dataset.id;

    insertCurtida(id);
}));

document.querySelector("#post-new-comment").addEventListener("click", event => {
    const postId = event.target.dataset.id;
    const name = document.querySelector("#name").value;
    const comment = document.querySelector("#comment").value;

    insertComentario({nome: name, texto: comment}, postId);
});