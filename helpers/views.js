import { getArenaChannel } from "./arenahelpers.js";

let axisH;
let axisHratio = 0.7;
/* -------------------------------------------
__ grid renderings
//,,-------------------------------------------*/
export function renderGrid(projects, container) {
  let divContainer = createFromHTML(`<div class="projects--container">
        <div class="projects--grid"></div>
        <div class="projects--info--grid"></div>
        </div>`);
  container.append(divContainer);
  const projectList = divContainer.querySelector(".projects--grid");
  generateGridProjects(projectList, projects);
  SliderObserver();
}
function generateGridProjects(projectList, projects) {
  projects.forEach((p) => {
    const tagsHTML = p.tags
      .map((item) => `<div class="project__tags">${item}</div>`)
      .join("");
    let Ptemp = createFromHTML(`<div class="p--container">
    <div class="p__left">
    <div class="circle--container">
    <div class="p__left--circle"></div></div>
    <div class="p__left--title">${p.title}</div>
    </div>
    <div class="p__tags">
    ${tagsHTML}

    <div class="p__left--year">${p.year ? p.year : ""}</div>
    <img class="p__thumbimage" src="${p.thumbnail}"></div>

    </div>`);
    projectList.append(Ptemp);
    p.el = Ptemp;

    addProjectEvent(p);
  });
  const imgShowHTML = createFromHTML(`
    <div class="img__show--container">
    <button class="img__show--btn"  >x</button>
    <img id="img__show" >
    </div>`);
  projectList.append(imgShowHTML);
  addImgBtnEvent(imgShowHTML.querySelector(".img__show--btn"));
}
/* -------------------------------------------
__ slider
//,,-------------------------------------------*/
// generate slider stuff
function generateSliderProject(project) {
  const tagsHTML = project.tags
    .map((item) => `<div class="info__tags">${item}</div>`)
    .join("");
  const mediumsHTML = project.mediums.length
    ? project.mediums
        .map((item) => `<div class="info__mediums">${item}</div>`)
        .join("")
    : null;
  // add images + video
  const imgHTML = project.imagesSmall.map(
    (item) => `<img src="${item}" class="info__img">`,
  );
  const tempSlider = createFromHTML2(
    `
    <div class="info__right"><div class="info__title">${project.title}
    <div class="info__year">${project.year}</div> 
    </div>
    <div class="info__gallery">${imgHTML}</div>
    <div class="info__cards">
        <div class="info__tags--container">${tagsHTML}</div>
        <div class="info__mediums--container">Mediums:\n${mediumsHTML}</div>
        </div>
        <div class="info__desc">${project.descriptionE}</div>
        </div>
        `,
  );
  return tempSlider;
}
//add the thumbnail image when you select on a project
function updateImage(project) {
  let tempContainer = document.querySelector(".img__show--container");
  tempContainer.classList.add("active");

  let tempImg = document.querySelector("#img__show");
  tempImg.src = project.thumbnail;
}
/* -------------------------------------------
__ event handelings
//,,-------------------------------------------*/
// img btn event
function addImgBtnEvent(btn) {
  btn.addEventListener("click", (e) => {
    try {
      let tempContainer = document.querySelector(".img__show--container");
      tempContainer.classList.remove("active");
    } catch (er) {
      console.error("bang", er);
    }
  });
}
//event for openning the slider
function addProjectEvent(project) {
  project.el.addEventListener("click", async (e) => {
    try {
      let gg = document.querySelector(".projects--info--grid");
      gg.classList.add("active");
      gg.innerHTML = ``;
      gg.append(generateSliderProject(project));
      updateImage(project);
      addImgShowEvent(document.querySelectorAll(".info__img"), project);
    } catch (error) {
      console.error("failed", error);
    }
  });
}
function addImgShowEvent(imgs, project) {
  imgs.forEach((i, index) => {
    i.addEventListener("click", (e) => {
      let tempImg = document.querySelector("#img__show");
      tempImg.src = project.images[index];
      let tempContainer = document.querySelector(".img__show--container");
      tempContainer.classList.add("active");
    });
  });
}
function SliderObserver() {
  const source = document.querySelector(".projects--grid");
  const target = document.querySelector(".projects--info--grid");
  const target2 = document.querySelector(".img__show--container");
  target.style.height = `${source.offsetHeight}px`;
  target2.style.height = `${source.offsetHeight}px`;

  // const observer = new ResizeObserver(() => {
  //   target.style.height = `${source.offsetHeight}px`;
  // });
  // observer.observe(source);
}

/* -------------------------------------------
__ render axis
//,,-------------------------------------------*/
export function renderAxis(projects, container) {
  let divContainer = createFromHTML(`<div class="projects--container">
        <div class="projects--axis">
        <div id="crosshair-v" class="hair"></div>
        <div id="crosshair-h" class="hair"></div>
        </div>
        <div class="projects--cards"></div>
        </div>`);
  container.append(divContainer);
  const projectList = divContainer.querySelector(".projects--axis");
  const projectCards = divContainer.querySelector(".projects--cards");
  axisH = window.innerHeight * axisHratio;
  divContainer.style.height = `${axisH}px`;
  generateAxisProjects(projects, projectList);
  generateAxisCards(projects, projectCards);
}
function generateAxisCards(projects, parentContainer) {
  let findN = findNpower(projects.length);
  console.log(projects.length);
  console.log(findN);
  projects.forEach((p, index) => {
    const tempAxisP = createFromHTML(`<div class="axisCard--container">
      <img class="info__img" src="${p.thumbnail}"> 
      <div class="info__title">${p.title}</div> 
      <div class="info__year">${p.year}</div> 
      </div>`);
    parentContainer.append(tempAxisP);
  });
  let string = "";
  for (let i = 0; i < findN; i++) {
    string += "1fr ";
  }
  console.log(string);
  parentContainer.style.gridTemplateColumns = string;
  parentContainer.style.gridTemplateRows = string;
}
function generateAxisProjects(projects, parentContainer) {
  // find the height and width we are getting fed to
  let findN = findNpower(projects.length);
  let clWidth = window.innerWidth / findN;
  let clHeight = window.innerHeight / findN;
  projects.forEach((p, index) => {
    const tempAxisP = createFromHTML(`<div class="p--container">
      <img class="p__img" src="${p.thumbnail}"> 
      <div class="p__title">${p.title}</div> 
      <div class="p__year">${p.year}</div> 
      </div>`);
    let x, y;
    do {
      x = Math.floor(Math.random() * window.innerWidth);
      y = Math.floor(Math.random() * axisH);
    } while (
      x >= (index % findN) * clWidth &&
      x <= ((index + 1) % findN) * clWidth &&
      y >= Math.floor(index / findN) * clHeight &&
      y <= (Math.floor(index / findN) + 1) * clHeight
    );
    console.log("x ", x);
    console.log("y ", y);
    console.log(tempAxisP);
    parentContainer.append(tempAxisP);
    tempAxisP.style.left = `${x}px`;
    tempAxisP.style.top = `${y}px`;
  });
}
/* -------------------------------------------
__ helpers
//,,-------------------------------------------*/
function findNpower(number) {
  let tempI = 1;
  do {
    tempI++;
  } while (number > tempI * tempI);
  return tempI;
}
function createFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function createFromHTML2(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content;
}
