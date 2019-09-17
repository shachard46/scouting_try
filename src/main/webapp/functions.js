function getRandomColor() {
  var letters = "0123456789A";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 11)];
  }
  return color;
}
function orderBy(avgs, propId) {
  if (headers[propId].type == "boolean") {
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
  createAvgsTable(avgs, false);
  document.getElementsByTagName("thead")[0].childNodes.forEach(tr => {
    var x = Array.from(tr.childNodes)
      .filter(th => th.tagName == "TH")
      .map(th =>
        th.id == propId
          ? (th.querySelectorAll("button")[0].className = "selected-th")
          : (th.querySelectorAll("button")[0].className = "not-selected-th")
      );
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
    .filter(key => headers[key].type !== "text")
    .sort((a, b) =>
      Number(a) > Number(b) ? 1 : Number(b) > Number(a) ? -1 : 0
    )
    .map(
      key =>
        `<th class="header" id=${key}>
        <button style="color: #b4b4b4;"	onclick="orderBy(avgs, ${key})">
        ${headers[key].name}
        </button>
        </th>`
    )
    .forEach(e => (tr.innerHTML += e));
}

function createAvgsTable(avgs, first) {
  document.getElementsByTagName("tbody")[0].remove();
  var tbody = document.createElement("tbody");
  document.getElementsByTagName("table")[0].appendChild(tbody);
  if (first) {
    avgs.sort((a, b) =>
      a.teamId > b.teamId ? 1 : b.teamId > a.teamId ? -1 : 0
    );
  }
  avgs.forEach(team => {
    const tr = document.createElement("TR");
    const teamId = document.createElement("TD");
    teamId.textContent = team.teamId;
    teamId.className = "header";
    tr.appendChild(teamId);
    _.keys(team)
      .filter(key => key !== "teamId" && team[key] !== "text")
      .sort((a, b) =>
        Number(a) > Number(b) ? 1 : Number(b) > Number(a) ? -1 : 0
      )
      .map(key => {
        return `<td class="tooltip"> ${team[key]} <span class="tooltiptext">${team.teamId} </span>`;
      })
      .forEach(element => (tr.innerHTML += element));
    tbody.appendChild(tr);
  });
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

function addCombination(headers, avgs, colomns, index, name, type) {
  headers[index] = { name: name, type: type };
  avgs.map(
    team =>
      (team[index] = colomns.reduce((acc, curr) => acc + Number(team[curr]), 0))
  );
}
