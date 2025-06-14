document.addEventListener("DOMContentLoaded", function() {
    fetch("itens.json")
        .then(response => response.json())
        .then(data => {
            // Ordenar por categoria antes de exibir
            data.sort((a, b) => a.categoria.localeCompare(b.categoria));

            const lista = document.getElementById("lista");
            let categoriaAtual = "";

            data.forEach(item => {
                // Adiciona um cabeçalho para cada nova categoria
                if (item.categoria !== categoriaAtual) {
                    categoriaAtual = item.categoria;
                    let header = document.createElement("h3");
                    header.textContent = `📌 ${categoriaAtual}`;
                    lista.appendChild(header);
                }

                let li = document.createElement("li");
                li.style.listStyleType = "none"; // Remove os pontos da lista
                
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.dataset.nome = item.nome;
                checkbox.dataset.emoji = item.emoji;
                checkbox.addEventListener("change", function() {
                    quantidade.style.display = this.checked ? "inline-block" : "none";
                });

                let label = document.createElement("label");
                label.textContent = `${item.emoji} ${item.nome} (${item.unidade || "un"})`;

                let quantidade = document.createElement("input");
                quantidade.type = "number";
                quantidade.min = "1";
                quantidade.value = "1";
                quantidade.style.display = "none";
                quantidade.style.width = "50px";
                quantidade.dataset.nome = item.nome;
                quantidade.dataset.emoji = item.emoji;

                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(quantidade);
                lista.appendChild(li);
            });
        });
});
function enviarWhatsApp() {
    let selecionados = document.querySelectorAll("input[type=checkbox]:checked");
    let mensagem = "*Minha Lista de Compras*\n\n";

    selecionados.forEach(checkbox => {
        let quantidadeInput = checkbox.parentNode.querySelector("input[type=number]");
        let nome = checkbox.dataset.nome;
        let unidade = checkbox.dataset.unidade || "un";
        let quantidade = quantidadeInput.value;

        // Adiciona os itens sem emojis na mensagem
        mensagem += `- ${nome} (${quantidade} ${unidade})\n`;
    });

    // Codifica corretamente a mensagem e gera o link para WhatsApp
    let url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, "_blank"); // Abre o WhatsApp com a mensagem pronta
}

