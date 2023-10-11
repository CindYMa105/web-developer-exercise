// Fetch programs data
async function Func() {    
    fetch("./OpenDay.json")
        .then(res => {
            return res.json();
        })
        .then(data => {getPrograms(data)})
        .catch (error =>  {        
            console.log("Error: ", error);
        })
}

(async function() {
    await Func();
})();

let programsList = [];
let currentProgramsList = [];

//Clone card template for each program
function cloneCard(programsList){
    if("content" in document.createElement("template")){
        for(let program of programsList){
            const programTemplate = document.querySelector("#program-details");
            const programClone = programTemplate.content.cloneNode(true);

            //Display program location image
            let programCoverImg = programClone.querySelector("img");
            programCoverImg.src = program.cover_image;
            programCoverImg.alt = program.location;

            //Display program title & program type 
            let programTitle = programClone.querySelector("strong");
            programTitle.textContent = program.title + " - " + program.type;

            //Display program location
            let location = programClone.querySelector("h4");
            location.textContent = program.location;

            //Display program address in details
            let locationDetails = programClone.querySelector("h5");
            locationDetails.textContent =  program.address + " (" + program.postcode + ")" + " - " + program.room;

            //Display bike icon if the location allows bike parking
            if(program.bike_parking === 1){
                programClone.querySelector(".bi-bicycle").setAttribute("visibility", "visible");
            } 
            
            //Display car icon if the location allows car parking
            if(program.parking === 1){
                programClone.querySelector(".bi-car-front-fill").setAttribute("visibility", "visible");
            }

            //Display program start & end datetime
            let programDate = programClone.querySelector(".text-body-secondary");
            programDate.textContent = program.start_time + " - " + program.end_time;

            //Display program description
            let programDescription = programClone.querySelector("p");
            programDescription.textContent = program.description;

            //Display program location website (open in new tab)
            let locationLink = programClone.querySelector("a");    
            locationLink.href = program.website;    

            document.getElementById('main').appendChild(programClone);
        }
    } else {
        console.log("The HTML template element is not supported.");
    }
}

function displaySortedPrograms(unsortedProgramsList) {
    document.getElementById("main").innerHTML = "";
    
    let event = document.querySelector(".form-select");

    //Program alphabet sort by ascending order 
    if(event.value === "1"){
        unsortedProgramsList.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
        cloneCard(unsortedProgramsList);

    }else if (event.value === "2"){ //Program alphabet sort by descending order 
        unsortedProgramsList.sort((a, b) => {
            return a.title.localeCompare(b.title);
        }).reverse();
        cloneCard(unsortedProgramsList);

    } else { //Program id sort by ascending order when "Please select" is chosen
        unsortedProgramsList.sort((a, b) => {    
           return  a.id - b.id;
        });
        cloneCard(unsortedProgramsList);
    }
}

function displayFilteredPrograms(inputValue){
    document.getElementById("main").innerHTML = "";
    let input = inputValue;
    input = input.toLowerCase();        

    let programFilteredList = [];

    //Can search the key word in program title, start & end datetime, program location and program type
    for(let program of currentProgramsList){
        if(program.title.toLowerCase().includes(input) || program.start_time.includes(input) || program.end_time.includes(input) || 
            program.room.toLowerCase().includes(input) || program.location.toLowerCase().includes(input) || 
            program.address.toLowerCase().includes(input) || program.postcode.toLowerCase().includes(input) || program.type.toLowerCase().includes(input))
            {
                programFilteredList.push(program);
            }
    }

    currentProgramsList = programFilteredList;
    cloneCard(programFilteredList);
}

function getPrograms(data){
    //Create a new flat array for every programs element
    let programsFlatList = data.topics.flatMap(x => x.programs);

    programsList = programsFlatList.map(y => (
        {
            id: y.id, 
            start_time: y.start_time,
            end_time: y.end_time,
            title: y.title,
            description: y.description,
            room: y.room,
            location: y.location.title,
            address: y.location.address,
            postcode: y.location.postcode,
            cover_image: y.location.cover_image,
            website: y.location.website,
            parking: y.location.parking,
            bike_parking: y.location.bike_parking,
            type: y.programType.type
        }
    ));

    currentProgramsList = programsList.map(x => x);

    cloneCard(programsList);   

    //Sorting programs 
    document.querySelector(".form-select").addEventListener("change", () => {
        displaySortedPrograms(currentProgramsList);
    });
    
    //Filter programs by searching input
    document.querySelector(".btn-outline-success").addEventListener("click", () => {
        displayFilteredPrograms(document.querySelector(".form-control").value)
    });

    //Clear the input value and reset the results 
    document.querySelector(".btn-outline-primary").addEventListener("click", ()=> {
        document.querySelector(".form-control").value = "";
        document.getElementById("main").innerHTML = "";

        currentProgramsList = [];
        currentProgramsList = programsList.map(x => x);

        if(document.querySelector('.form-select').value == "0"){
            cloneCard(programsList);
        } else {
            displaySortedPrograms(currentProgramsList);
        }
    });
}
