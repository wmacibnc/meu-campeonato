document.addEventListener('DOMContentLoaded', function() {
    const tournamentDataString = localStorage.getItem('tournamentData');
    const tournamentData = JSON.parse(tournamentDataString);

    if (tournamentData && tournamentData.formaDisputa === 'mata-mata') {
        setupMatchups(tournamentData.jogadores);
    }
});

function setupMatchups(players, matchupsTableId = 'matchupsTable') {
    const matchupsTable = document.getElementById(matchupsTableId);
    matchupsTable.innerHTML = ''; // Limpar tabela anterior, se necessário

    for (let i = 0; i < players.length; i += 2) {
        const row = matchupsTable.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.innerText = players[i] ? `${players[i].name} (${players[i].team})` : 'Aguardando';
        cell2.innerHTML = players[i + 1] ? '<input type="number" min="0" style="width: 50px;"> vs <input type="number" min="0" style="width: 50px;">' : 'Avança automaticamente';
        cell3.innerText = players[i + 1] ? `${players[i + 1].name} (${players[i + 1].team})` : '';

        // Botão Salvar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar';
        saveButton.onclick = () => saveResult(i, players, matchupsTable);
        cell4.appendChild(saveButton);

        // Se número de jogadores for ímpar, o último avança automaticamente
        if (i + 1 >= players.length) {
            saveButton.disabled = true;
            cell5.innerText = `Vencedor: ${players[i].name}`; // Marca automaticamente como vencedor
        } else {
            // Colocando espaço para o resultado (atualizado após salvar)
            cell5.innerText = '';
        }
    }

    
     // Adicionando o botão "Continuar Confrontos" após montar os confrontos iniciais
     const continueButton = document.createElement('button');
     continueButton.textContent = 'Continuar Confrontos';
     continueButton.className = 'btn btn-success mt-3';
     continueButton.id = 'continueButton';
     continueButton.style.display = 'none'; // Inicialmente escondido
     continueButton.onclick = () => continueMatchups(players);
     document.getElementById('championshipProgress').appendChild(continueButton);
 
     
     // Mostrar o botão após todos os resultados serem salvos
     continueButton.style.display = 'block';  
    

   
}

function saveResult(matchIndex, players, table) {
    const row = table.rows[matchIndex / 2]; // Ajuste conforme a estrutura do seu HTML
    const scoreInputs = row.cells[1].querySelectorAll('input[type="number"]');
    const resultCell = row.cells[4];

    if (scoreInputs.length === 2) {
        const score1 = parseInt(scoreInputs[0].value, 10);
        const score2 = parseInt(scoreInputs[1].value, 10);

        let winner;
        if (score1 > score2) {
            winner = players[matchIndex].name;
        } else if (score2 > score1) {
            winner = players[matchIndex + 1].name;
        } else {
            // Empate, decide por sorteio
            winner = Math.random() < 0.5 ? players[matchIndex].name : players[matchIndex + 1].name;
            resultCell.innerText = 'Empate (Decidido por sorteio)';
        }

        resultCell.innerText += ` Vencedor: ${winner}`;
    }
}

function continueMatchups(players) {
    // Coleta os vencedores da rodada anterior, incluindo os que avançaram automaticamente
    const winners = [];
    const resultsCells = document.querySelectorAll('#matchupsTable tr td:last-child');
    resultsCells.forEach(cell => {
        const winnerText = cell.innerText;
        const winnerName = winnerText.split('Vencedor: ')[1]?.trim();
        const winner = players.find(player => player.name === winnerName);
        if (winner) winners.push(winner);
    });

    // Não esconde a tabela e o botão da rodada anterior
    // document.getElementById('matchupsTable').style.display = 'none'; // Remover esta linha
    document.getElementById('continueButton').style.display = 'none'; // Esconde apenas o botão continuar

    // Cria um título para a nova rodada
    const championshipProgress = document.getElementById('championshipProgress');
    const roundTitle = document.createElement('h3');
    roundTitle.textContent = 'Nova Rodada';
    championshipProgress.appendChild(roundTitle);

    // Prepara uma nova tabela para os confrontos dos vencedores
    const newMatchupsTableId = 'newMatchupsTable' + (document.querySelectorAll('.matchupsTable').length + 1);
    const newMatchupsTable = document.createElement('table');
    newMatchupsTable.id = newMatchupsTableId; // Garante um ID único
    newMatchupsTable.className = 'table table-bordered matchupsTable'; // Adiciona uma classe para estilização e seleção
    championshipProgress.appendChild(newMatchupsTable);

    // Chama setupMatchups com os vencedores para montar a nova tabela, passando o novo ID da tabela
    setupMatchups(winners, newMatchupsTableId);
}


function getRoundTitle(playerCount) {
    switch(playerCount) {
        case 16:
        case 15:
            return "Oitavas de Final";
        case 8:
        case 7:
            return "Quartas de Final";
        case 4:
        case 3:
            return "Semi Final";
        case 2:
            return "Final";
        default:
            return "Rodada Atual";
    }
}

