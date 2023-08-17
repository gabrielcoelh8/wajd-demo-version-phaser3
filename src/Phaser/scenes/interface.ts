/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HEALTH_EVENTS } from '../system/Events';
import Health from '../system/HealthSystem';

const ASSET_KEY = 'ASSET_KEY';

const HEALTH_ANIMATIONS = {
  LOSE_FIRST_HALF: 'LOSE_FIRST_HALF',
  LOSE_SECOND_HALF: 'LOSE_SECOND_HALF',
} as const;

export default class Interface extends Phaser.Scene {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #health: Health;
  #hearts: Phaser.GameObjects.Sprite[] = [];

  constructor(emitter: Phaser.Events.EventEmitter, health: Health) {
    super();
    this.#customEventEmitter = emitter;
    this.#health = health;
  }

  create(): void {
    const numberOfHearts = Math.round(this.#health.maxHealth / 2);
    for (let i = 0; i < numberOfHearts; i++) { 
      const heart = this.add
        .sprite(10 + i * 43, 10, ASSET_KEY, 0)
        .setScale(5)
        .setOrigin(0);
        this.#hearts.push(heart);
    }

    this.#customEventEmitter.on(HEALTH_EVENTS.LOSE_HEALTH, (newHealth: any, prevHealth: number) => {
      console.log('event received', newHealth, prevHealth);
      const heartIndex = Math.round(prevHealth / 2) - 1;
      const isHalfHeart = prevHealth % 2 === 1;
      
      if (isHalfHeart) {
        this.#hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_SECOND_HALF);
      } else {
        this.#hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_FIRST_HALF);
      }
    }, this);
  }

  update(_time: number, _delta: number): void {
    
  }
}