class Node {
  constructor(word) {
    this.children = new Array(31);
    this.word = word;
  }
}
let dict = null;
getDict();
let wordlist_iter = null;
let dictionary_def = null;

const searchInputDOM = document.querySelector(".search-input");
const searchResultWrapperDOM = document.querySelector(".search-result-wrapper");
const definitionsDOM = document.querySelector(".definitions");
searchInputDOM.addEventListener("input", (event) => {
  let curr = null;
  let next_word = null;
  searchResultWrapperDOM.innerHTML = "";
  if (event.target.value.length == 0) {
    return;
  }
  wordlist_iter = autocorrect(event.target.value);
  for (let i = 0; i < 5; i++) {
    next_word = wordlist_iter.next();
    if (next_word.done) {
      return;
    }
    curr = document.createElement("div");
    curr.classList.add("search-result");
    curr.innerHTML = next_word.value;
    curr.addEventListener("click", (event) => {
      loadDictionaryDefinition(event.target.innerHTML);
    });
    searchResultWrapperDOM.appendChild(curr);
  }
  curr = document.createElement("div");
  curr.classList.add("next-items");
  curr.innerHTML = "Get Next Results";
  curr.addEventListener("click", () => {
    document.querySelectorAll(".search-result").forEach((element) => {
      let curr_word = wordlist_iter.next();
      console.log(curr_word);
      if (curr_word.done === true) {
        return;
      }
      element.innerHTML = curr_word.value;
    });
  });
  searchResultWrapperDOM.appendChild(curr);
});

async function loadDictionaryDefinition(word) {
  let data = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
  );
  let info = await data.json();
  dictionary_def = info;
  definitionsDOM.id = 0;
  renderDef(info[0]);
}
function renderDef(def) {
  definitionsDOM.classList.remove("hidden");
  definitionsDOM.innerHTML = "";
  let header = document.createElement("h1");
  header.innerHTML = def.word;
  header.classList.add("header");
  definitionsDOM.appendChild(header);
  let phonetic = document.createElement("h3");
  phonetic.innerHTML = def.phonetic;
  phonetic.classList.add("phonetic");
  definitionsDOM.appendChild(phonetic);
  let partofspeech = "";
  for (let i = 0; i < def.meanings.length; i++) {
    let partofspeech = document.createElement("h2");
    partofspeech.innerHTML = def.meanings[i].partOfSpeech;
    partofspeech.classList.add("partofspeech");
    definitionsDOM.appendChild(partofspeech);
    for (let j = 0; j < def.meanings[i].definitions.length; j++) {
      let definition = document.createElement("p");
      definition.innerHTML = `${j + 1}. ${
        def.meanings[i].definitions[j].definition
      }`;
      definition.classList.add("definition");
      definitionsDOM.appendChild(definition);

      if (def.meanings[i].definitions[j].example) {
        let meaning = document.createElement("p");
        meaning.innerHTML = `Ex: "${def.meanings[i].definitions[j].example}"`;
        meaning.classList.add("meaning");
        definitionsDOM.appendChild(meaning);
      }
    }
  }
  let def_controller = document.createElement("div");
  def_controller.classList.add("controller");
  let left_button = document.createElement("i");
  left_button.classList.add("fa", "fa-arrow-left");
  left_button.addEventListener("click", () => {
    curr_def = parseInt(definitionsDOM.id);
    if (curr_def != 0) {
      definitionsDOM.id = curr_def - 1;
      renderDef(dictionary_def[curr_def - 1]);
    }
  });
  let right_button = document.createElement("i");
  right_button.classList.add("fa", "fa-arrow-right");
  right_button.addEventListener("click", () => {
    curr_def = parseInt(definitionsDOM.id);
    if (curr_def != dictionary_def.length - 1) {
      definitionsDOM.id = curr_def + 1;
      renderDef(dictionary_def[curr_def + 1]);
    }
  });
  def_controller.appendChild(left_button);
  def_controller.appendChild(right_button);
  definitionsDOM.appendChild(def_controller);
}

function get_correct_spells(word, tol, node, wordlist) {
  let edit_dist = edit_distance(word, node.word);
  if (edit_dist < tol) {
    wordlist.words.push([node.word, edit_dist]);
  }
  let minbound = Math.max(0, edit_dist - tol);
  let maxbound = Math.min(31, edit_dist + tol + 1);
  for (let i = minbound; i < maxbound; i++) {
    if (node.children[i]) {
      get_correct_spells(word, tol, node.children[i], wordlist);
    }
  }
}

function* autocorrect(word) {
  let wordlist = {
    words: [],
  };
  node = dict;
  get_correct_spells(word, 4, node, wordlist);
  wordlist.words.sort((w1, w2) => {
    return w1[1] - w2[1];
  });
  let index = 0;
  while (index < wordlist.words.length) {
    yield wordlist.words[index][0];
    index += 1;
  }
}

async function getDict() {
  let rawtxt = "a";
  rawtxt = await fetch("google-10000-english.txt");
  rawtxt = await rawtxt.text();
  rawtxt = rawtxt.trim().split("\n");
  dict = build_tree(rawtxt);
}

function build_tree(dict) {
  let root = new Node(dict[0]);
  for (let i = 1; i < dict.length; i++) {
    let curr = new Node(dict[i]);
    root = bk_traverse(curr, root);
  }
  return root;
}

function bk_traverse(node, root) {
  let curr = root;
  let edit_dist = 0;
  while (curr) {
    edit_dist = edit_distance(node.word, curr.word);
    if (curr.children[edit_dist]) {
      curr = curr.children[edit_dist];
      continue;
    } else {
      curr.children[edit_dist] = node;
      break;
    }
  }
  return root;
}
function edit_distance(w1, w2) {
  dp = [];
  for (let i = 0; i < w1.length + 1; i++) {
    dp.push([]);
    for (let j = 0; j < w2.length + 1; j++) {
      dp[i].push(0);
    }
  }

  for (let i = 0; i < w1.length + 1; i++) {
    for (let j = 0; j < w2.length + 1; j++) {
      if (i == 0) {
        dp[i][j] = j;
        continue;
      }
      if (j == 0) {
        dp[i][j] = i;
        continue;
      }
      if (w1[i - 1] == w2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + mindp(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[w1.length][w2.length];
}

function mindp(v1, v2, v3) {
  if (v1 <= v2 && v1 <= v3) {
    return v1;
  } else if (v2 <= v1 && v2 <= v3) {
    return v2;
  } else {
    return v3;
  }
}
