document.addEventListener("DOMContentLoaded", function() {
    fetch("itens.json")
        .then(response => response.json())
        .then(data => {
            // Ordena por categoria
            data.sort((a, b) => a.categoria.localeCompare(b.categoria));

            const lista = document.getElementById("lista");
            let categoriaAtual = "";

            data.forEach(item => {
                // Adiciona um cabeçalho para cada categoria
                if (item.categoria !== categoriaAtual) {
                    categoriaAtual = item.categoria;
                    let header = document.createElement("h3");
                    header.textContent = `📌 ${categoriaAtual}`;
                    lista.appendChild(header);
                }

                let li = document.createElement("li");
                li.classList.add("lista-item"); // Classe para alinhar no CSS
                
                let container = document.createElement("div");
                container.classList.add("item-container");

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.dataset.nome = item.nome;
                checkbox.dataset.unidade = item.unidade || "un";
                checkbox.addEventListener("change", function() {
                    quantidade.style.display = this.checked ? "inline-block" : "none";
                });

                let label = document.createElement("label");
                label.textContent = `${item.nome} (${item.unidade || "un"})`;

                let quantidade = document.createElement("input");
                quantidade.type = "number";
                quantidade.min = "1";
                quantidade.value = "1";
                quantidade.style.display = "none";
                quantidade.style.width = "50px";

                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(quantidade);
                
                li.appendChild(container);
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

