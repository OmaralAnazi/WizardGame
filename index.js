import characterData from './data.js';
import Character from './Character.js';

const wizard = new Character(characterData.hero);
const attackBtn = document.getElementById('attack-button');
let monstersList = ['orc', 'demon', 'goblin'];
let monster = getNewMonster();
let isWaiting = false;

attackBtn.addEventListener('click', attack);

function getNewMonster() {
    const nextMonsterData = characterData[monstersList.shift()];
    return nextMonsterData ? new Character(nextMonsterData) : {};
}

function attack() {
    if (!isWaiting) {
        // Play Animation:
        setTimeout(playAnimations, 1);

        wizard.updateDiceHtml();
        monster.updateDiceHtml();
        wizard.takeDamage(monster.currentDiceScore);
        monster.takeDamage(wizard.currentDiceScore);
        render();
        
        if (wizard.dead) {
            endGame();
        }
        else if (monster.dead) {
            isWaiting = true;
            attackBtn.disabled = true;
            if (monstersList.length !== 0) {
                setTimeout(() => {
                    monster = getNewMonster();
                    render();
                    isWaiting = false;
                    attackBtn.disabled = false;
                }, 1500);
            }
            else {
                endGame();
            }
        }    
    }
}

function playAnimations() {
    document.querySelectorAll('.character-card').forEach(character => {
        character.classList.add('shake-animation');
    });
}

function endGame() {
    isWaiting = true;
    const endMessage = wizard.dead && monster.dead && monstersList.length === 0 ? 'No victors - all creatures are dead' :
                       !wizard.dead ? 'The Wizard Wins' : 'The monsters are Victorious';

    const endEmoji = !wizard.dead ? '🔮' : '☠️';

    setTimeout(() => {
        document.body.innerHTML = `
            <div class='end-game'>
                <h2>Game Over</h2> 
                <h3>${endMessage}</h3>
                <p class='end-emoji'>${endEmoji}</p>
            </div>
            `;
    }, 1500);
}

function render() {
    document.getElementById('hero').innerHTML = wizard.getCharacterHtml();
    document.getElementById('monster').innerHTML = monster.getCharacterHtml();
}

render();
