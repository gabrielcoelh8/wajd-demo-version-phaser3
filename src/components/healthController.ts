import { HEALTH_EVENTS } from '../util/events';

export default class HealthController {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #currentHealth: number;
  #maxHealth: number;

  constructor(customEventEmitter: Phaser.Events.EventEmitter) {
    this.#currentHealth = 6;
    this.#maxHealth = 6;
    this.#customEventEmitter = customEventEmitter;
  }

  get maxHealth(): number {
    return this.#maxHealth;
  }

  get currentHealth(): number {
    return this.#currentHealth;
  }

  set setCurrentHealth(health: number) {
    this.#currentHealth = health
  }

  public loseHealth(): void {
    if (this.#currentHealth === 0) {
      return;
    }
    this.#currentHealth -= 1;
    this.#customEventEmitter.emit(HEALTH_EVENTS.LOSE_HEALTH, this.#currentHealth, this.#currentHealth + 1);
  }

  public init(): void {
    this.#currentHealth = 6
  }
}