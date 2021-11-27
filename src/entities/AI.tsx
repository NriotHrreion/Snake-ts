/* eslint-disable eqeqeq */
import Snake from "../objects/Snake";
import Game from "../components/Game";
import Ghost from "./Ghost";
import Utils from "../utils";

namespace AI {
    export class GhostAI {
        private game: Game<{}>;
        private snake: Snake;
        private self: Ghost;
        
        public constructor(game: Game<{}>, self: Ghost) {
            this.game = game;
            this.snake = this.game.snake;
            this.self = self;

            document.body.addEventListener("snakeMove", () => this.onMove());
        }

        private onMove(): void {
            var headPosition = this.snake.getHeadPosition();
            var selfPosition = this.self.getPosition();

            if(selfPosition.x < headPosition.x) {
                this.self.setPosition({x: selfPosition.x + 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
            } else if(selfPosition.x > headPosition.x) {
                this.self.setPosition({x: selfPosition.x - 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
            }

            if(selfPosition.x == headPosition.x) {
                if(selfPosition.y < headPosition.y) {
                    this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y + 1});
                } else if(selfPosition.y > headPosition.y) {
                    this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y - 1});
                }
            }
        }
    }
    
    /**
     * @todo Robot AI
     */
    export class RobotAI {
        private game: Game<{}>;
        
        public constructor(game: Game<{}>) {
            this.game = game;
        }
    }
}

export default AI;
