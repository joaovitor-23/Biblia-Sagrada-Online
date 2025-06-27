// Mapeamento das categorias por testamento
const categorias = {
    "Antigo Testamento": ["Pentateuco", "Históricos", "Sapienciais", "Proféticos"],
    "Novo Testamento": ["Evangelhos", "Histórico", "Epístolas paulinas", "Epístolas Católicas", "Revelação"]
};

// Mapeamento completo dos livros por categoria
const livrosPorCategoria = {
    "Pentateuco": ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio"],
    "Históricos": ["Josué", "Juízes", "Rute", "I Samuel", "II Samuel", "I Reis", "II Reis", "I Crônicas", "II Crônicas", "Esdras", "Neemias", "Tobias", "Judite", "Ester", "I Macabeus", "II Macabeus"],
    "Sapienciais": ["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cântico dos Cânticos", "Sabedoria", "Eclesiástico"],
    "Proféticos": ["Isaías", "Jeremias", "Lamentações", "Baruc", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Abdias", "Jonas", "Miquéias", "Naum", "Habacuc", "Sofonias", "Ageu", "Zacarias", "Malaquias"],
    "Evangelhos": ["São Mateus", "São Marcos", "São Lucas", "São João"],
    "Histórico": ["Atos dos Apóstolos"],
    "Epístolas paulinas": ["Romanos", "I Coríntios", "II Coríntios", "Gálatas", "Efésios", "Filipenses", "Colossenses", "I Tessalonicenses", "II Tessalonicenses", "I Timóteo", "II Timóteo", "Tito", "Filêmon", "Hebreus"],
    "Epístolas Católicas": ["São Tiago", "I São Pedro", "II São Pedro", "I São João", "II São João", "III São João", "São Judas"],
    "Revelação": ["Apocalipse"]
};

// Carregar categorias quando um testamento é selecionado
document.getElementById('testamento').addEventListener('change', function() {
    const testamento = this.value;
    const selectCategoria = document.getElementById('categoria');

    selectCategoria.innerHTML = '<option value="">Selecione a Categoria</option>';
    document.getElementById('livro').innerHTML = '<option value="">Selecione o Livro</option>';
    document.getElementById('capitulo').innerHTML = '<option value="">Capítulo</option>';
    document.getElementById('versiculos').innerHTML = '';

    if (!testamento) return;

    categorias[testamento].forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
});

// Carregar livros quando uma categoria é selecionada
document.getElementById('categoria').addEventListener('change', function() {
    const categoria = this.value;
    const selectLivro = document.getElementById('livro');

    selectLivro.innerHTML = '<option value="">Selecione o Livro</option>';
    document.getElementById('capitulo').innerHTML = '<option value="">Capítulo</option>';
    document.getElementById('versiculos').innerHTML = '';

    if (!categoria) return;

    livrosPorCategoria[categoria].forEach(livro => {
        const option = document.createElement('option');
        option.value = livro;
        option.textContent = livro;
        selectLivro.appendChild(option);
    });
});

// Carregar capítulos quando um livro é selecionado
document.getElementById('livro').addEventListener('change', function() {
    const livro = this.value;
    const selectCapitulo = document.getElementById('capitulo');
    const container = document.getElementById('versiculos');

    selectCapitulo.innerHTML = '<option value="">Capítulo</option>';
    container.innerHTML = '';

    if (!livro) return;

    // Mostrar indicador de carregamento
    selectCapitulo.innerHTML = '<option value="">Carregando...</option>';

    // Encontrar o caminho do JSON baseado no testamento e categoria
    const testamento = document.getElementById('testamento').value;
    const categoria = document.getElementById('categoria').value;
    const caminhoBase = `livros_da_biblia/${testamento}/${categoria}/${livro}.json`;

    fetch(caminhoBase)
        .then(response => {
            if (!response.ok) {
                throw new Error('Livro não encontrado');
            }
            return response.json();
        })
        .then(data => {
            selectCapitulo.innerHTML = '<option value="">Selecione o Capítulo</option>';

            data.capitulos.forEach(capitulo => {
                const option = document.createElement('option');
                option.value = capitulo.capitulo;
                option.textContent = capitulo.capitulo;
                selectCapitulo.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar capítulos:", error);
            selectCapitulo.innerHTML = '<option value="">Erro ao carregar</option>';
        });
});

// Buscar versículos
document.getElementById('buscar').addEventListener('click', function() {
    const livro = document.getElementById('livro').value;
    const capitulo = document.getElementById('capitulo').value;
    const container = document.getElementById('versiculos');

    if (!livro || !capitulo) {
        alert("Selecione um livro e um capítulo!");
        return;
    }

    // Mostrar indicador de carregamento
    container.innerHTML = '<p class="loading">Carregando...</p>';

    const testamento = document.getElementById('testamento').value;
    const categoria = document.getElementById('categoria').value;
    const caminhoBase = `livros_da_biblia/${testamento}/${categoria}/${livro}.json`;

    fetch(caminhoBase)
        .then(response => {
            if (!response.ok) {
                throw new Error('Capítulo não encontrado');
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';
            const capituloData = data.capitulos.find(c => c.capitulo == capitulo);

            if (!capituloData) {
                container.innerHTML = '<p class="error">Capítulo não encontrado.</p>';
                return;
            }

            // Adicionar título do capítulo
            const titulo = document.createElement('h2');
            titulo.textContent = `${livro} - Capítulo ${capitulo}`;
            container.appendChild(titulo);

            // Adicionar versículos
            capituloData.versiculos.forEach(versiculo => {
                const versiculoDiv = document.createElement('div');
                versiculoDiv.className = 'versiculo';
                versiculoDiv.innerHTML = `<strong>${versiculo.versiculo}</strong> ${versiculo.texto}`;
                container.appendChild(versiculoDiv);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar versículos:", error);
            container.innerHTML = '<p class="error">Erro ao carregar o capítulo. Tente novamente.</p>';
        });
});

// Função para carregar um versículo aleatório
function carregarVersiculoAleatorio() {
    const container = document.getElementById('dailyVerse');
    container.innerHTML = '<p class="loading">Carregando versículo do dia...</p>';

    // Lista de todos os livros da Bíblia
    const todosLivros = [
        // Antigo Testamento
        { testamento: "Antigo Testamento", categoria: "Pentateuco", livro: "Gênesis" },
        { testamento: "Antigo Testamento", categoria: "Pentateuco", livro: "Êxodo" },
        // ... adicione todos os outros livros seguindo o mesmo padrão
        // Novo Testamento
        { testamento: "Novo Testamento", categoria: "Evangelhos", livro: "São Mateus" },
        { testamento: "Novo Testamento", categoria: "Evangelhos", livro: "São Marcos" },
        // ... adicione todos os outros livros
    ];

    // Selecionar um livro aleatório
    const livroAleatorio = todosLivros[Math.floor(Math.random() * todosLivros.length)];
    const caminho = `livros_da_biblia/${livroAleatorio.testamento}/${livroAleatorio.categoria}/${livroAleatorio.livro}.json`;

    fetch(caminho)
        .then(response => {
            if (!response.ok) throw new Error('Livro não encontrado');
            return response.json();
        })
        .then(data => {
            // Selecionar um capítulo aleatório
            const capituloAleatorio = data.capitulos[Math.floor(Math.random() * data.capitulos.length)];

            // Selecionar um versículo aleatório
            const versiculoAleatorio = capituloAleatorio.versiculos[
                Math.floor(Math.random() * capituloAleatorio.versiculos.length)
                ];

            // Exibir o versículo
            container.innerHTML = `
                <p class="verse-text">"${versiculoAleatorio.texto}"</p>
                <p class="verse-ref">${livroAleatorio.livro} ${capituloAleatorio.capitulo}:${versiculoAleatorio.versiculo}</p>
            `;
        })
        .catch(error => {
            console.error("Erro ao carregar versículo aleatório:", error);
            container.innerHTML = '<p class="error">Não foi possível carregar o versículo do dia</p>';
        });
}

// Carregar versículo aleatório quando a página carregar
document.addEventListener('DOMContentLoaded', carregarVersiculoAleatorio);