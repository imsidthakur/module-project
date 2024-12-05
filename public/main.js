const imageHeading = document.getElementById("picture-heading");
const imageTitle = document.getElementById("picture-title");
const imageExplanation = document.getElementById("picture-explanation");
let image = document.getElementById("picture");
const imageContainer = document.getElementById("current-image-container");
const form = document.getElementById("search-form");
const ul = document.getElementById("search-history");

form.addEventListener("submit",getImageOfTheDay)
ul.addEventListener("click",handlePreviousLinkClick)


async function getImage(date) {
    const api = `/.netlify/functions/fetch-nasa-image?date=${date}`;
    const data = await fetch(api).then((res) => res.json());
    return data;
  }


async function getCurrentImageOfTheDay()
{
    const currentDate = new Date().toISOString().split("T")[0];
    const data = await getImage(currentDate);
    renderData(data);
}

async function getImageOfTheDay(e)
{
    e.preventDefault();
    const inputValue = form["search-input"].value.trim(); 
    const isValidDate = !isNaN(Date.parse(inputValue));
    if(!isValidDate) return;
    const currentDate = new Date(inputValue).toISOString().split("T")[0];
    const data = await getImage(currentDate);
    renderData(data);
}

function renderData(data)
{
    if(data.media_type == "video")
    {
        if(image?.nodeName == "IMG")
        {
            image.remove();
            const frame = document.createElement("iframe");
            frame.setAttribute("id","picture");
            frame.setAttribute("src",data?.url);
            image = frame;
            imageContainer.insertBefore(frame,imageContainer.children[1]);
        }
        else{
            image.setAttribute("src",data?.url);
        }
    }
    else{
        if(image?.nodeName == "IFRAME")
        {
            image.remove();
            const img = document.createElement("img");
            img.setAttribute("id","picture");
            img.setAttribute("src",data?.url);
            image = img;
            imageContainer.insertBefore(img,imageContainer.children[1]);
        }
        else{
            image.setAttribute("src",data?.url);
        }

    }
    imageTitle.textContent = data?.title;
    imageExplanation.textContent = data?.explanation;


    const imageDate = new Date(data?.date);
    const currentDate = new Date();

    imageDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);


    if(imageDate.getTime() === currentDate.getTime())
    {
        imageHeading.textContent = "NASA Picture of the day";
    }
    else{
        const year = imageDate.getFullYear();
        const month = String(imageDate.getMonth() + 1).padStart(2, '0');   
        const day = String(imageDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        imageHeading.textContent = "Picture on " + formattedDate;
        saveSearch(formattedDate);
    
    }
}

function saveSearch(date)
{
    const currentList = JSON.parse(localStorage.getItem("list") || '[]');
    if(!currentList?.includes(date))
    {
        currentList.push(date);
        localStorage.setItem("list",JSON.stringify(currentList));
    }
    addSearchToHistory();
}

function addSearchToHistory()
{
    const currentList = JSON.parse(localStorage.getItem("list") || '[]');
    ul.innerHTML = '';

    currentList.forEach((item) =>{
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.textContent = item;

        li.append(link);

        ul.append(li);
        
    })
}


async function handlePreviousLinkClick(e)
{
   e.preventDefault();
   if(e.target.nodeName == "A" && e.target.parentNode.nodeName == "LI")
   {
    const dateString = e.target.textContent;
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    const data = await getImage(formattedDate);
    renderData(data);
   }
}

getCurrentImageOfTheDay();
