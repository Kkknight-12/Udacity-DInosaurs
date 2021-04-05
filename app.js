function Animal( species, weight, height, diet, facts ){
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.facts = facts;
    this.image = "images/" + species.toLowerCase() + ".png";
}

Animal.prototype.AddFacts = function( fact ){
    this.facts.push(fact)
}

Animal.prototype.compareName = function(name) {
    let fact = "Our names are on equal position.";
    if ( this.species > name ) {
        fact = "Hey my name comes first in dictionary 😝";
    } else {
        fact = "Your name comes first in dictionary 😭";
    }
    return  this.AddFacts(fact);
};

Animal.prototype.compareHeight = function(height) {
    let fact = "We stand at equal height.";
    if (this.height > height) {
        fact = "Obviosly I Am  Taller 😝";``
    } else {
        fact = "Need to say you are Taller 😒";
    }
    return  this.AddFacts(fact);
};

Animal.prototype.compareWeight = function (weight) {
    let fact = "Your weight is same as mine.";
    if (this.weight > weight) {
        fact = "I Am Bigger And Heavier 😋";
    } else {
        fact = "OH you are Heavier Than Me 😖";
    }
    return  this.AddFacts(fact);
};

Animal.prototype.compareDiet = function(diet) {
    if ( this.diet === (diet).toLowerCase() ) {
        fact = `Hey we both are ${this.diet}`;
    } else {
        fact = `I am a ${this.diet}`;
    }
    return  this.AddFacts(fact);
};

let ranListNum = [];

const generateRandomNum = (num) => {
  let index;
  index = Math.floor(Math.random() * 10) % num;
  return index;
}

Animal.prototype.getRandomFact = function () {
    let index = generateRandomNum(this.facts.length);
    if( this.species === "Pigeon"){
        return this.facts = this.facts[0];
    }
    while( (ranListNum.includes(index) || index === 0 ) ){
        index = generateRandomNum(this.facts.length);
    }
    ranListNum.push(index)
    return this.facts = this.facts[index];
};

function Dinos( species, weight, height, diet, facts ){
    Animal.call(this, species, weight, height, diet, facts );
}

Dinos.prototype = Object.create(Animal.prototype);

// Create Dino Constructor
Object.defineProperty( Dinos.prototype , "constructor", {
    enumerable: false, 
	value: Dinos,
    writable: true,
});

let dinoData = []

fetch('./dino.json')
    .then( response => response.json() )
    .then( data => dinoData = data.Dinos.map( 
            dino => new Dinos(dino.species, dino.weight, dino.height, dino.diet,
            [dino.fact, `I am a ${dino.species}.`, `I am from ${dino.where}.`, `I lived in ${dino.when}.` ]
            
    )));

// Create Human Object
function Human( name, height, weight, diet ){
    Animal.call( this, 'human', weight, height, diet )
    this.name = name;
}

Human.prototype = Object.create(Animal.prototype);

Object.defineProperty( Human.prototype , "constructor", {
    enumerable: false, 
	value: Human,
    writable: true,
});

// Use IIFE to get human data from form
const humanData = ( 
    function (){
    return function(){
        let name = document.getElementById('name').value
        let feet = document.getElementById('feet').value
        let inches = document.getElementById('inches').value
        let height = parseFloat(feet + '.' + inches) 
        let weight = document.getElementById('weight').value
        let diet = document.getElementById('diet').value
        weight = parseFloat(weight);
        return new Human(name, height, weight, diet) 
    }

})();

document.getElementById("btn").addEventListener("click", function(e){
    e.preventDefault()
    
    const human = humanData();

    // check form is filled 
    if( !human.name || isNaN(human.height) || isNaN(human.weight)  ){
        return alert('Please Fill In Form To Compare')
    }

    dinoData.splice(4, 0,  human  ); 
    
    // Dino Compare Method 1, 2, 3
    dinoData.forEach( (data) => {
        const { species } = data;
        if( species === 'human' ){
            return
        }
        data.compareName(human.name)
        data.compareHeight(human.height)
        data.compareWeight(human.weight)
        data.compareDiet(human.diet)
    })

    dinoData.forEach( ( data ) => {
        let { facts } = data;
        if( facts !== undefined ){
            return facts = data.getRandomFact(facts)
        }
    })    
    
    // Remove form from screen
    document.getElementById( 'dino-compare' ).style.display = 'none';
    
    let tryagain = document.getElementById( 'try-again' )
    tryagain.style.display = 'block';

    tryagain.addEventListener( 'click', function(){
        location.reload()
    })

    // Generate Tiles for each Dino in Array
    dinoData.map( ( data ) => {
        if( data.species === 'human' ){
            return document.getElementById("grid").appendChild(
                gridItems( data.species, data.image )
            )
        }else{
            return document.getElementById("grid").appendChild(
                gridItems( data.species, data.image , data.facts )
            )
        }
    })

});

// On button click, prepare and display infographic
function gridItems( species, imgUrl, fact ) {
    let gridDiv = document.createElement("div");
    gridDiv.className = "grid-item";

    let speciesName = document.createElement("h3");
    speciesName.innerText = species;
    gridDiv.appendChild(speciesName);

    let specieImg = document.createElement("img");
    specieImg.src = imgUrl;
    gridDiv.appendChild(specieImg);

    if (fact) {
        let randomFact = document.createElement("p");
        randomFact.innerText = fact;
        gridDiv.appendChild(randomFact);
    }
    return gridDiv;
}