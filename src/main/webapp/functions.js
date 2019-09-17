function getRandomColor() {
  var letters = "0123456789A";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 11)];
  }
  return color;
}
function orderBy(avgs, propId) {
  if (avgs[0][propId][avgs[0][propId].length - 1] === "%") {
    avgs.sort((a, b) => {
      var first = a[propId].substring(
        a[propId].indexOf("|") + 2,
        a[propId].length - 1
      );
      var second = b[propId].substring(
        b[propId].indexOf("|") + 2,
        b[propId].length - 1
      );
      if (Number(first) > Number(second)) {
        return -1;
      }
      if (Number(first) < Number(second)) {
        return 1;
      }
      return 0;
    });
  } else {
    avgs.sort((a, b) =>
      a[propId] > b[propId] ? -1 : b[propId] > a[propId] ? 1 : 0
    );
  }
  document.getElementsByTagName("tbody")[0].childNodes.forEach(tr => {
    if (tr.tagName == "TR") {
      var i = 0;
      var j = 0;
      tr.childNodes.forEach(td => {
        if (td.className != "header") {
          td.textContent = avgs[i][j];
          var tooltip = document.createElement("span");
          tooltip.className = "tooltiptext";
          tooltip.textContent = avgs[i].teamId;
          td.appendChild(tooltip);
          j++;
        } else {
          td.textContent = avgs[i].teamId;
        }
      });
      i++;
    }
  });
  console.log(avgs);
  document.getElementsByTagName("thead")[0].childNodes.forEach(tr => {
    tr.childNodes.forEach(th => {
      if (th.tagName == "TH") {
        if (th.id == propId) {
          th.childNodes[0].className = "selected-th";
        } else {
          th.childNodes[0].className = "not-selected-th";
        }
      }
    });
  });
  return false;
}

function filterByTeamNumbers(avgs) {
  var teamStr = document.getElementsByName("filterTeams")[0].value;
  teamStr = teamStr ? teamStr.trim() : "";
  if (teamStr !== "") {
    var teams = _.map(teamStr.split(","), item => item.trim());
    return _.filter(avgs, item => _.contains(teams, item.teamId));
  }
  return avgs;
}

function createAvgsHeaders(headers) {
  var thead = document.createElement("thead");
  var tr = document.createElement("tr");
  tr.innerHTML = "<td class='header'>מספר קבוצה</td>";
  thead.appendChild(tr);
  document.getElementsByTagName("table")[0].appendChild(thead);
  _.keys(headers)
    .sort((a, b) =>
      Number(a) > Number(b) ? 1 : Number(b) > Number(a) ? -1 : 0
    )
    .map(
      key =>
        `<th class="header" id=${key} onclick="orderBy(avgs, ${key})">${headers[key]}</th>`
    )
    .forEach(e => (tr.innerHTML += e));
  console.log(headers);
}

function createAvgsTable(avgs) {
  document.getElementsByTagName("tbody")[0].remove();
  var tbody = document.createElement("tbody");
  document.getElementsByTagName("table")[0].appendChild(tbody);
  avgs.sort((a, b) => (a.teamId > b.teamId ? 1 : b.teamId > a.teamId ? -1 : 0));
  avgs.forEach(team => {
    const tr = document.createElement("TR");
    const teamId = document.createElement("TD");
    teamId.textContent = team.teamId;
    teamId.className = "header";
    tr.appendChild(teamId);
    _.keys(team)
      .filter(key => key !== "teamId")
      .sort((a, b) =>
        Number(a) > Number(b) ? 1 : Number(b) > Number(a) ? -1 : 0
      )
      .map(key => {
        console.log(`${team.teamId} key: `, key);
        return `<td class="tooltip"> ${team[key]} <span class="tooltiptext">${team.teamId} </span>`;
      })
      .forEach(element => (tr.innerHTML += element));
    tbody.appendChild(tr);
  });
  console.log(avgs);
}
function createPitScoutingTable(pitScouting, teamId) {
  pitScouting = pitScouting.props;
  var table = document.getElementsByTagName("table")[0];
  var team = document.createElement("tr");
  team.insertCell(0);
  team.insertCell(1);
  team.cells[0].className = "header";
  team.cells[1].className = "header";
  team.cells[0].append("מספר קבוצה");
  team.cells[1].append(teamId);
  table.appendChild(team);
  for (var prop in pitScouting) {
    var tr = document.createElement("tr");
    tr.insertCell(0);
    tr.insertCell(1);
    tr.cells[0].append(prop);
    tr.cells[0].className = "header";
    tr.cells[1].append(pitScouting[prop]);
    table.appendChild(tr);
  }
}
function createGraph(labels, propsLabels, data) {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: Object.keys(propsLabels).map(key => ({
        label: propsLabels[key].name,
        fill: false,
        data: labels.map(label => data[labels.indexOf(label)][key]),
        borderColor: [getRandomColor()],
        borderWidth: 4
      }))
    },
    options: {
      title: {
        display: true,
        text: "קבוצה מספר " + data[0].teamId,
        fontSize: 45,
        fontFamily: "tahoma"
      },
      legend: {
        labels: {
          fontColor: "#b4b4b4",
          fontSize: 15,
          fontFamily: "tahoma"
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "#b4b4b4",
              fontSize: 20,
              fontFamily: "tahoma"
            },
            gridLines: {
              color: "#b4b4b4"
            },
            legend: {
              fontColor: "#b4b4b4",
              fontSize: 15,
              fontFamily: "tahoma",
              text: "מספרי משחק"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#b4b4b4",
              fontSize: 20,
              fontFamily: "tahoma",
              beginAtZero: true
            },
            gridLines: { color: "#b4b4b4" }
          }
        ]
      }
    }
  });
}

function addCombination(headers, avgs, colomns, newColoumn, newColoumnName) {
  headers[newColoumn] = newColoumnName;
  avgs.map(
    team =>
      (team[newColoumn] = colomns.reduce(
        (acc, curr) => acc + Number(team[curr]),
        0
      ))
  );
}
