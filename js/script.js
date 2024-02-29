document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('initialForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const format = document.querySelector('input[name="competitionFormat"]:checked').value;
    const playerCount = document.getElementById('playerCount').value;
  
    // Mostrar o segundo formulário
    const detailsForm = document.getElementById('detailsForm');
    detailsForm.innerHTML = `<h2>Forma de disputa: ${format}</h2>`;
  
    for (let i = 0; i < playerCount; i++) {
        detailsForm.innerHTML += `
          <div class="row form-group">
            <div class="col">
              <label for="playerName${i}">Nome do Jogador ${i + 1}:</label>
              <input type="text" class="form-control" id="playerName${i}" name="playerName${i}" required>
            </div>
            <div class="col">
              <label for="playerTeam${i}">Nome do Time:</label>
              <input type="text" class="form-control" id="playerTeam${i}" name="playerTeam${i}" required>
            </div>
          </div>
        `;
      }
  
    detailsForm.innerHTML += `<button type="button" id="playButton" class="btn btn-fifa">Jogar</button>`;
    detailsForm.classList.remove('d-none');
  
    document.getElementById('playButton').addEventListener('click', function() {
      const players = [];
      for (let i = 0; i < playerCount; i++) {
        players.push({
          id: i + 1,
          name: document.getElementById(`playerName${i}`).value,
          team: document.getElementById(`playerTeam${i}`).value,
          points: 0
        });
      }
  
      const tournamentStructure = document.getElementById('tournamentStructure');
      tournamentStructure.innerHTML = '';
      tournamentStructure.classList.remove('d-none');
      let confrontos = {};
      if (format === 'mata-mata') {
        // Embaralha a lista de jogadores
        players.sort(() => Math.random() - 0.5);
  
        // Gera confrontos
        let matchups = '<h2>Campeonato mata mata</h2><br /><tr><th>Mandante</th><th>-</th><th>Visitante</th></tr>';
        for (let i = 0; i < players.length; i += 2) {
          matchups += `
            <tr>
              <td>${players[i].name} (${players[i].team})</td>
              <td>vs</td>
              <td>${players[i + 1] ? players[i + 1].name + ' (' + players[i + 1].team + ')' : 'Aguardando'}</td>
            </tr>
          `;
        }
        tournamentStructure.innerHTML = `<table class="table table-dark">${matchups}</table>`;
      } else {
        // Ordena jogadores por nome
        players.sort((a, b) => a.name.localeCompare(b.name));
  
        // Gera tabela de pontos corridos
        let leagueTable = '<h2>Campeonato por pontos corridos</h2><br /><tr><th>&#35;</th><th>Nome</th><th>Time</th><th>Pontos</th></tr>';
        players.forEach(player => {
          leagueTable += `
            <tr>
              <td>${player.id}</td>
              <td>${player.name}</td>
              <td>${player.team}</td>
              <td>${player.points}</td>
            </tr>
          `;
        });
        tournamentStructure.innerHTML = `<table class="table table-dark">${leagueTable}</table>`;
      }
       // Gerando o JSON com os dados do torneio
    const tournamentData = {
      formaDisputa: format,
      jogadores: players
    };

  // Adicionando o botão "Iniciar Campeonato"
  const startButton = document.createElement('button');
  startButton.innerText = 'Iniciar Campeonato';
  startButton.className = 'btn btn-fifa';
  startButton.addEventListener('click', () => {
      // fetch('/teste.html', { // Substitua 'sua_api_ou_url_para_simular' pela URL da sua API
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(tournamentData)
      // }).then(response => {
      //     // Simulação de envio, já que não temos uma URL real
      //     // Redirecionamento para jogar.html com os dados enviados via método GET, localStorage ou SessionStorage
      //     localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
      //     window.location.href = 'jogar.html';
      // }).catch(error => console.error('Error:', error));
      // Redirecionamento para jogar.html com os dados enviados via método GET, localStorage ou SessionStorage
           localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
           window.location.href = 'jogar.html';

  });

  document.getElementById('tournamentStructure').appendChild(startButton);
    });
  });
});
