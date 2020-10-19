let loadHome = () => {
    showLoader()
    let dtMatch = getMatches();
    let dtTopScore = getTopGoal();
    let select = ''
    let match = ''
    let topScore = ''
    let html = ''
    html += `
    <div class="card">
        <div class="card-content">
            <h1 id="leagueName"></h1>
        </div>
        <div class="card-tabs">
            <ul class="tabs tabs-fixed-width">
                <li class="tab"><a class="active" href="#match">Match</a></li>
                <li class="tab"><a href="#news">News</a></li>
                <li class="tab"><a href="#topScore">Top Score</a></li>
                <li class="tab"><a href="#standing">Standing</a></li>
                <li class="tab"><a href="#test6">Test 3</a></li>
            </ul>
        </div>
    `;

    dtMatch.then(data => {
        // leagueName
        document.getElementById("leagueName").innerHTML = `${data.competition.area.name}, ${data.competition.name}`;
        // select MatchDay
        match += `
            <div class="row">
                <label>Match Day</label>
                <select id="select" onchange="console.log(this.value)">

                </select>               
            </div>
        `;
        match += `
            <table class="striped responsive-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Home</th>
                        <th>Score</th>
                        <th>Away</th>
                        <th>Halftime</th>
                        <th>Extratime</th>
                        <th>Penalty</th>
                    </tr>
                    </thead>
            
                    <tbody>
        `;
        let groupMatchday = groupBy(data.matches, 'matchday');
        if(groupMatchday) {
            // select MatchDay   
            for(let key in groupMatchday) {
                select += `
                    <option value = "${key}">Match Day - ${key}</option>
                `;
            }

            let dtGroupMatchday = (matchday) => {
                groupMatchday[matchday].map((data, i) => {
                    let date = new Date(data.utcDate);
                    match += `
                        <tr>
                            <td>${i+1}</td>
                            <td>${date.toLocaleString()}</td>
                            <td>${data.status}</td>
                            <td>${data.homeTeam.name}</td>
                            <td>${(data.score.fullTime.homeTeam != null) ? data.score.fullTime.homeTeam : '-'} : ${(data.score.fullTime.awayTeam != null) ? data.score.fullTime.awayTeam : '-'}</td>
                            <td>${data.awayTeam.name}</td>
                            <td>${(data.score.halfTime.homeTeam != null) ? data.score.halfTime.homeTeam : '-'} : ${(data.score.halfTime.awayTeam != null) ? data.score.halfTime.awayTeam : '-'}</td>
                            <td>${(data.score.extraTime.homeTeam != null) ? data.score.extraTime.homeTeam : '-'} : ${(data.score.extraTime.awayTeam != null) ? data.score.extraTime.awayTeam : '-'}</td>
                            <td>${(data.score.penalties.homeTeam != null) ? data.score.penalties.homeTeam : '-'} : ${(data.score.penalties.awayTeam != null) ? data.score.penalties.awayTeam : '-'}</td>
                        </tr>
                    `;
                })
            }

            // Find data match if status schedule to find round active
            for(let key in data.matches) {
                if(data.matches[key].status === 'SCHEDULED') {
                    dtGroupMatchday(data.matches[key].matchday)
                    break
                } else if(data.matches[key].status === 'FINISHED') {
                    dtGroupMatchday(data.matches[key].matchday)
                    break
                } else {
                    dtGroupMatchday(data.matches[key].matchday)
                    break
                }
            }
        }
        match += `
            </tbody>
            </table>
        `;
        document.getElementById("match").innerHTML = match;
        let sel = document.getElementById('select');
        let getComboA = (selectObject) => {
            var value = selectObject.value;
            console.log(value);
        }
        sel.innerHTML = select;

        // select
        var select = document.querySelectorAll('select');
        M.FormSelect.init(select, {});

        hideLoader();
    })

    dtTopScore.then(data => {
        topScore += `
            <table class="striped responsive-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>DOB</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Goal</th>
                </tr>
                </thead>
        
                <tbody>
        `;
        if(data) {
            data.scorers.map((datas, i) => {
                topScore += `
                    <tr>
                        <td>${i+1}</td>
                        <td>${datas.player.name}</td>
                        <td>${datas.player.nationality}</td>
                        <td>${datas.player.countryOfBirth}, ${datas.player.dateOfBirth}</td>
                        <td>${datas.team.name}</td>
                        <td>${datas.player.position}</td>
                        <td>${datas.numberOfGoals}</td>
                    </tr>
                `;
            })
        }
        topScore += `
            </tbody>
            </table>
        `;
        document.getElementById("topScore").innerHTML = topScore;
        hideLoader()
    });


    html += `
        <div class="card-content">
            <div id="match"></div>
            <div id="news"></div>
            <div id="topScore"></div>
            <div id="standing">Test 2</div>
            <div id="test6">Test 3</div>
        </div>
    </div>
    `;
    document.getElementById("body-content").innerHTML = html;
}

var loadMatches = () => {
    showLoader()
    var matches = getMatches()
    matches.then(data => {
        matchesData = data;
        var matchdays = groupBy(data.matches, 'matchday');

        html = ''
        for (const key in matchdays) {
            if (key != 'null') {
                html += `
                <h5>Group stage - ${key} of 6</h5>
                <div class="row">
              `
                matchdays[key].forEach(match => {
                    html += `
            <div class="col s12 m6 l6">
              <div class="card">
                <div class="card-content card-match">
                <div style="text-align: center"><h6>${dateToDMY(new Date(match.utcDate))}</h6></div>
                  <div class="col s10">${match.homeTeam.name}</div>
                  <div class="col s2">${match.score.fullTime.homeTeam}</div>
                  <div class="col s10">${match.awayTeam.name}</div>
                  <div class="col s2">${match.score.fullTime.awayTeam}</div>
                </div>
                <div class="card-action right-align">
                <a class="waves-effect waves-light btn-small" onclick="insertMatchListener(${match.id})"><i class="material-icons left">star</i>Add to Favorite</a>
                </div>
              </div>
            </div>
              `
                });
                html += `
          </div>`
            }

        }
        document.getElementById("header-title").innerHTML = 'Matches';
        document.getElementById("main-content").innerHTML = html;
        hideLoader()
    })
}

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };