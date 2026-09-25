import { getArenaChannel } from "./arenahelpers.js";

let axisH;
let axisHratio = 0.7;
let galleryIndex = 0;
let activeProject = null;
let gridProjects;
let mobileBreakPoint = 800;
/* -------------------------------------------
__ grid renderings
//,,-------------------------------------------*/
export function renderGrid(projects, container) {
  gridProjects = projects;
  let divContainer = createFromHTML(`<div class="projects--container">
        <div class="projects--grid"></div>
        <div class="projects--info--grid"></div>
        </div>`);
  container.append(divContainer);
  const projectList = divContainer.querySelector(".projects--grid");
  generateGridProjects(projectList, projects);
  SliderObserver();
  addAllEvents();
}

///
function generateGridProjects(projectList, projects) {
  projects.forEach((p, index) => {
    const tagsHTML = p.tags
      .map((item) => `<div class="project__tags">${item}</div>`)
      .join("");
    let Ptemp = createFromHTML(`<div class="p--container" data-index="${index}">
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
    // addProjectEvent(p);
  });
  // add the close btn for image + the event to close
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
    <div class="info__left">
    <div class="img__show--container active">
    <button class="img__show--btn">x</button>
    <img id="img__show" class="${checkVideo(project.allMedia[0])}" src="${project.allMedia[0]}">
    <video id="video__show" class="${checkVideo(project.allMedia[0])}"><source src="${project.allMedia[0]}" type="video/mp4"></video>
       </div>
    </div>
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

/* -------------------------------------------
__ gallery events
//,,-------------------------------------------*/

//push image forward or back?
function moveGallery(direction, project) {
  let allImgs = project.allMedia.length;
  let tempImg = document.querySelector("#img__show");
  let tempVideo = document.querySelector("#video__show");
  galleryIndex = galleryIndex + 1 * direction;
  if (galleryIndex / allImgs >= 1) galleryIndex = 0;
  else if (galleryIndex < 0) galleryIndex = allImgs - 1;
  // tempImg.src = allImgs[galleryIndex].src;
  const check = checkVideo(project.allMedia[galleryIndex]);
  tempVideo.classList = check;
  tempImg.classList = check;
  let tempVsource = tempVideo.querySelector("source");
  tempVsource.src = project.allMedia[galleryIndex];
  tempImg.src = project.allMedia[galleryIndex];
}

///
function addImgBtnEvent(btn) {
  btn.addEventListener("click", (e) => {
    try {
      if (window.innerWidth > mobileBreakPoint) {
        let tempContainer = document.querySelector(".img__show--container");
        let tempContainer2 = document.querySelector(".info__left");
        tempContainer.classList.remove("active");
        tempContainer2.style.display = "none";
      } else {
        let gg = document.querySelector(".projects--info--grid");
        gg.innerHTML = "";
        gg.classList.remove("active");
      }
    } catch (er) {
      console.error("bang", er);
    }
  });
}

function checkVideo(url) {
  const extension = url.split(".").pop().split(/[?#]/)[0].toLowerCase();

  // Define known formats
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const videoExtensions = ["mp4", "webm", "ogg"];

  if (imageExtensions.includes(extension)) return "image";
  else if (videoExtensions.includes(extension)) return "video";
}
//img clicking event
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
//add the thumbnail image when you select on a project
// function addThumbnailEvent(project) {
//   let tempContainer = document.querySelector(".img__show--container");
//   tempContainer.classList.add("active");
//   let tempImg = document.querySelector("#img__show");
//   tempImg.src = project.thumbnail;
// }
/* -------------------------------------------
__ event handelings
//,,-------------------------------------------*/
function addAllEvents() {
  //projects--grid
  let tempProject = document.querySelector(".projects--grid");
  tempProject.addEventListener("click", (e) => {
    const project = e.target.closest(".p--container");
    if (!project) return;
    const index = project.dataset.index;
    activeProject = gridProjects[index];
    initSlider(activeProject);
    //initslider, btn event, window event
  });
  window.addEventListener("keyup", (e) => {
    if (e.repeat) return;
    let gallery = document.querySelector(".img__show--container.active");
    if (!gallery || !activeProject) return;
    if (e.key == "ArrowLeft") {
      e.preventDefault();
      moveGallery(-1, activeProject);
    }
    if (e.key == "ArrowRight") {
      e.preventDefault();
      moveGallery(1, activeProject);
    }
  });
}

function initSlider(project) {
  let gg = document.querySelector(".projects--info--grid");
  gg.classList.add("active");
  //clear what was there before
  gg.innerHTML = ``;
  gg.append(generateSliderProject(project));
  addImgBtnEvent(gg.querySelector(".img__show--btn"));
  let v = gg.querySelector("#video__show.video");
  if (v) {
    // High-reliability autoplay properties
    v.autoplay = true;
    v.muted = true; // Required by browsers to allow autoplay
    v.playsInline = true;
  }
  let tempCheck = gg.querySelector(".img__show--container.active");
  if (tempCheck)
    tempCheck.addEventListener("click", (e) => moveGallery(1, activeProject));
  //add thumbnail
}

function SliderObserver() {
  const source = document.querySelector(".projects--grid");
  const target = document.querySelector(".projects--info--grid");
  const target2 = document.querySelector(".img__show--container.active");
  target.style.height = `${source.offsetHeight}px`;
  target2 ? (target2.style.height = `${source.offsetHeight}px`) : null;
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
