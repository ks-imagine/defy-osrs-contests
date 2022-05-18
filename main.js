/*
 ___________
< Variables >
 -----------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'

*/

const competition_id = 10087; // testing
// const competition_id = 11584; // live

// const competition_url = `https://api.wiseoldman.net/competitions/${competition_id}`;
// const metric_url = `https://api.wiseoldman.net/competitions/${competition_id}?metric=`;
const all_skills = {
  magic: "combat_fast",
  ranged: "combat_fast",
  prayer: "combat_fast",
  attack: "combat_slow",
  strength: "combat_slow",
  defence: "combat_slow",
  hitpoints: "combat_slow",
  construction: "skilling_buyable",
  farming: "skilling_buyable",
  fletching: "skilling_buyable",
  cooking: "skilling_fast",
  herblore: "skilling_fast",
  crafting: "skilling_fast",
  smithing: "skilling_fast",
  firemaking: "skilling_fast",
  thieving: "skilling_fast",
  agility: "skilling_slow",
  mining: "skilling_slow",
  fishing: "skilling_slow",
  hunter: "skilling_slow",
  slayer: "skilling_slow",
  runecrafting: "skilling_slow",
  woodcutting: "skilling_slow",
};
// manually update
const player_pets = {
  farming: ["The Western", "Blunko"],
  pvm: ["The Western", "Blunko"],
  thieving: [],
  agility: [],
  mining: [],
  fishing: [],
  hunter: ["The Western", "Blunko"],
  slayer: [],
  runecrafting: [],
  beaver: [],
};
const player_page = window.location.href.includes("player");

/*
 ___________________________
< Functions - Data Handling >
 ---------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Function to hide the loader
hideloader = () => {
  document.getElementById("loading").style.display = "none";
};

// Async function for competition data
getapi = async (url) => {
  // Storing response
  const response = await fetch(url);
  // Storing data in form of JSON
  var data = await response.json();
  if (response) {
    hideloader();
  }
  createPlayerArray(data);
};

// Create player array
createPlayerArray = (data) => {
  let playerArray = [];
  for (var i = 0; i < data.participants.length; i++) {
    playerArray.push({
      name: data.participants[i].displayName,
      totalXP: 0,
      combatXP: 0,
      skillingXP: 0,
      combat_fast: 0,
      combat_slow: 0,
      skilling_buyable: 0,
      skilling_fast: 0,
      skilling_slow: 0,
      skills: {},
    });
  }
  window.PLAYER_ARRAY = playerArray;

  for (skill in all_skills) {
    getSkillXP(metric_url + skill, skill, all_skills[skill]);
  }
};

// Async function for player combat xp data
getSkillXP = async (url, skillName, skillCategory) => {
  // Storing response
  const response = await fetch(url);
  var data = await response.json();
  if (response) {
    hideloader();
  }
  for (var i = 0; i < data.participants.length; i++) {
    for (var j = 0; j < window.PLAYER_ARRAY.length; j++) {
      if (data.participants[i].displayName == window.PLAYER_ARRAY[j].name) {
        if (skillCategory == "combat_fast") {
          if (data.participants[i].progress.gained <= 2500000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].combat_fast +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 2500000;
            window.PLAYER_ARRAY[j].combat_fast += 2500000;
          }
        } else if (skillCategory == "skilling_buyable") {
          if (data.participants[i].progress.gained <= 2500000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].skilling_buyable +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 2500000;
            window.PLAYER_ARRAY[j].skilling_buyable += 2500000;
          }
        } else if (skillCategory == "combat_slow") {
          if (data.participants[i].progress.gained <= 5000000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].combat_slow +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 5000000;
            window.PLAYER_ARRAY[j].combat_slow += 5000000;
          }
        } else if (skillCategory == "skilling_fast") {
          if (data.participants[i].progress.gained <= 5000000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].skilling_fast +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 5000000;
            window.PLAYER_ARRAY[j].skilling_fast += 5000000;
          }
        } else {
          window.PLAYER_ARRAY[j].skills[skillName] =
            data.participants[i].progress.gained;
          window.PLAYER_ARRAY[j].skilling_slow +=
            data.participants[i].progress.gained;
        }
      }
    }
  }
  calcTotalXP();
};

// Array to calculate skilling XP
calcTotalXP = () => {
  for (var i = 0; i < window.PLAYER_ARRAY.length; i++) {
    window.PLAYER_ARRAY[i].combatXP =
      window.PLAYER_ARRAY[i].combat_fast + window.PLAYER_ARRAY[i].combat_slow;
    window.PLAYER_ARRAY[i].skillingXP =
      window.PLAYER_ARRAY[i].skilling_buyable +
      window.PLAYER_ARRAY[i].skilling_fast +
      window.PLAYER_ARRAY[i].skilling_slow;
    window.PLAYER_ARRAY[i].totalXP =
      window.PLAYER_ARRAY[i].combatXP + window.PLAYER_ARRAY[i].skillingXP;
  }
  showExperienceData();
};

// This can only be done every 24 hours. Update via bookmarklet on WiseOldMan competition page instead.
updatePlayers = async () => {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ verificationCode: "033-031-170" }),
  };
  try {
    const fetchResponse = await fetch(
      competition_url + "/update-all",
      settings
    );
    const data = await fetchResponse.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};
// updatePlayers();

/*
 ___________________________
< Functions - Tables & Sums >
 ---------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Function to define innerHTML for HTML table
showExperienceData = (category, column) => {
  const table = document.getElementById("players");
  let tab = "<tr><th class='clickable' onclick='sortTable(0)'>Player Name</th>";
  if (category == "overall" || !category) {
    tab += "<th class='clickable' onclick='sortTable(1)'>Total XP</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Combat XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Skilling XP</th>";
  } else if (category == "combat_fast") {
    tab += "<th class='clickable' onclick='sortTable(1)'>Combat - Big XP</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Magic XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Ranged XP</th>";
    tab += "<th class='clickable' onclick='sortTable(4)'>Prayer XP</th>";
  } else if (category == "combat_slow") {
    tab += "<th class='clickable' onclick='sortTable(1)'>Combat - Melee</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Attack XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Strength XP</th>";
    tab += "<th class='clickable' onclick='sortTable(4)'>Defense XP</th>";
    tab += "<th class='clickable' onclick='sortTable(5)'>Hitpoints XP</th>";
  } else if (category == "skilling_buyable") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'>Skilling - Big XP Buyables</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Construction XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Farming XP</th>";
    tab += "<th class='clickable' onclick='sortTable(4)'>Fletching XP</th>";
  } else if (category == "skilling_fast") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'>Skilling - Fast Gains</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Cooking XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Herblore XP</th>";
    tab += "<th class='clickable' onclick='sortTable(4)'>Crafting XP</th>";
    tab += "<th class='clickable' onclick='sortTable(5)'>Smithing XP</th>";
    tab += "<th class='clickable' onclick='sortTable(6)'>Firemaking XP</th>";
    tab += "<th class='clickable' onclick='sortTable(7)'>Thieving XP</th>";
  } else if (category == "skilling_slow") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'>Skilling - Slow Gains</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Agility XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Mining XP</th>";
    tab += "<th class='clickable' onclick='sortTable(4)'>Fishing XP</th>";
    tab += "<th class='clickable' onclick='sortTable(5)'>Hunter XP</th>";
    tab += "<th class='clickable' onclick='sortTable(6)'>Slayer XP</th>";
    tab += "<th class='clickable' onclick='sortTable(7)'>Runecrafting XP</th>";
    tab += "<th class='clickable' onclick='sortTable(8)'>Woodcutting XP</th>";
  }
  tab += "</tr>";
  for (let p of window.PLAYER_ARRAY) {
    if (category == "overall" || !category) {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.totalXP.toLocaleString("en-US")} </td>
      <td>${p.combatXP.toLocaleString("en-US")} </td>
      <td>${p.skillingXP.toLocaleString("en-US")} </td>
      </tr>`;
    } else if (category == "combat_fast") {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.combat_fast.toLocaleString("en-US")} </td>
      <td>${p.skills.magic.toLocaleString("en-US")} </td>
      <td>${p.skills.ranged.toLocaleString("en-US")} </td>
      <td>${p.skills.prayer.toLocaleString("en-US")} </td>
      </tr>`;
    } else if (category == "combat_slow") {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.combat_slow.toLocaleString("en-US")} </td>
      <td>${p.skills.attack.toLocaleString("en-US")} </td>
      <td>${p.skills.strength.toLocaleString("en-US")} </td>
      <td>${p.skills.defence.toLocaleString("en-US")} </td>
      <td>${p.skills.hitpoints.toLocaleString("en-US")} </td>
      </tr>`;
    } else if (category == "skilling_buyable") {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.skilling_buyable.toLocaleString("en-US")} </td>
      <td>${p.skills.construction.toLocaleString("en-US")} </td>
      <td>${p.skills.farming.toLocaleString("en-US")} </td>
      <td>${p.skills.fletching.toLocaleString("en-US")} </td>
      </tr>`;
    } else if (category == "skilling_fast") {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.skilling_fast.toLocaleString("en-US")} </td>
      <td>${p.skills.cooking.toLocaleString("en-US")} </td>
      <td>${p.skills.herblore.toLocaleString("en-US")} </td>
      <td>${p.skills.crafting.toLocaleString("en-US")} </td>
      <td>${p.skills.smithing.toLocaleString("en-US")} </td>
      <td>${p.skills.firemaking.toLocaleString("en-US")} </td>
      <td>${p.skills.thieving.toLocaleString("en-US")} </td>
      </tr>`;
    } else if (category == "skilling_slow") {
      tab += `<tr>
      <td>${p.name}</td>
      <td>${p.skilling_slow.toLocaleString("en-US")} </td>
      <td>${p.skills.agility.toLocaleString("en-US")} </td>
      <td>${p.skills.mining.toLocaleString("en-US")} </td>
      <td>${p.skills.fishing.toLocaleString("en-US")} </td>
      <td>${p.skills.hunter.toLocaleString("en-US")} </td>
      <td>${p.skills.slayer.toLocaleString("en-US")} </td>
      <td>${p.skills.runecrafting.toLocaleString("en-US")} </td>
      <td>${p.skills.woodcutting.toLocaleString("en-US")} </td>
      </tr>`;
    }
  }
  table.innerHTML = tab;
  if (category == "overall" || !category) {
    sumXP();
    removeActiveCategoryFilter();
    addActiveCategoryFilter("c1");
  } else {
    removeActiveCategoryFilter();
    addActiveCategoryFilter(column);
  }
  document.getElementById("searchField").value = "";
  sortTable(1, true);
};

sumXP = () => {
  const table = document.getElementById("players");

  if (!document.getElementById("totals")) {
    table.innerHTML += `
    <tr id="totals">
    <th>TOTALS</th>
    <th>Total XP: <br />0</th>
    <th>Combat XP: <br />0</th>
    <th>Skilling XP: <br />0</th>
    </tr>
    `;
  }

  let totalXP = 0;
  let combatXP = 0;
  let skillingXP = 0;
  for (var i = 1; i < table.rows.length - 1; i++) {
    if (!table.rows[i].classList.contains("hide")) {
      totalXP += parseFloat(table.rows[i].cells[1].innerHTML.replace(/,/g, ""));
      combatXP += parseFloat(
        table.rows[i].cells[2].innerHTML.replace(/,/g, "")
      );
      skillingXP += parseFloat(
        table.rows[i].cells[3].innerHTML.replace(/,/g, "")
      );
    }
  }
  totalXP = totalXP.toLocaleString("en-US");
  combatXP = combatXP.toLocaleString("en-US");
  skillingXP = skillingXP.toLocaleString("en-US");

  let tab = `<tr id="totals">
    <th>TOTALS</th>
    <th>Total XP: <br />${totalXP}</th>
    <th>Combat XP: <br />${combatXP}</th>
    <th>Skilling XP: <br />${skillingXP}</th>
  </tr>`;
  document.getElementById("totals").innerHTML = tab;
};

/*
 __________________________________
< Functions - Search, Filter, Sort >
 ----------------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'

*/

searchTable = (category, column) => {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchField");
  if (category && !input.value) {
    filter = category.toUpperCase();
    removeActiveCategoryFilter();
    addActiveCategoryFilter(column);
  } else if (!category && input.value) {
    filter = input.value.toUpperCase();
  } else {
    filter = input.value.toUpperCase();
    removeActiveCategoryFilter();
    addActiveCategoryFilter(column);
  }
  table = document.getElementById("players");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (var i = 1; i < tr.length; i++) {
    // Hide the row initially.
    tr[i].classList.add("hide");
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < 2; j++) {
      cell = tr[i].getElementsByTagName("td")[j];
      if (cell) {
        if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].classList.remove("hide");
          break;
        }
      }
    }
  }
  sortTable(2, true);
  if (category == "overall") {
    sumXP();
  }
};

removeActiveCategoryFilter = () => {
  for (
    var i = 0;
    i < document.getElementsByClassName("categorySelect").length;
    i++
  ) {
    document
      .getElementsByClassName("categorySelect")
      [i].classList.remove("currentCategory");
  }
};

addActiveCategoryFilter = (column) => {
  document.getElementsByClassName(column)[0].classList.add("currentCategory");
};

sortTable = (column, resetSort) => {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    tableHeight,
    switchcount = 0;
  table = document.getElementById("players");
  switching = true;
  if (resetSort) {
    dir = "desc";
  } else {
    dir = "asc";
  }
  while (switching) {
    switching = false;
    rows = table.rows;
    if (document.getElementsByClassName("c1 currentCategory")) {
      tableHeight = 2;
    } else {
      tableHeight = 1;
    }
    for (i = 1; i < rows.length - tableHeight; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      if (column > 0) {
        x = parseInt(x.innerHTML.replace(/\,/g, ""), 10);
        y = parseInt(y.innerHTML.replace(/\,/g, ""), 10);
      }
      if (dir == "asc" && column == 0) {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "asc" && column > 0) {
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc" && column == 0) {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc" && column > 0) {
        if (x < y) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};

/*
 _______
< Start >
 -------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Call async function (start)
getapi(competition_url);
