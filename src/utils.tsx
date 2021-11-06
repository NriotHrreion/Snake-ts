/* eslint-disable eqeqeq */
export default class Utils {
    public static getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static setBgOfAllClasses(className: string, value: string): void {
        if(document.body.getElementsByTagName("style").length > 0) {
            document.body.removeChild(document.body.getElementsByTagName("style")[0]);
        }
        
        var styleElem = document.createElement("style");
        styleElem.innerText = ".snake-body{background-color:"+ value +" !important;}";
        document.body.appendChild(styleElem);
    }

    public static arrayItemDelete(arr: any[], item: any): any[] {
        if(item == undefined) return arr;

        for(let i in arr) {
            if(typeof arr[i] == "object" && typeof item == "object") {
                if(this.objectsCompare(arr[i], item)) {
                    arr[i] = undefined;
                    continue;
                }
            }
            
            if(arr[i] == item) {
                arr[i] = undefined;
            }
        }

        var newarr = [];
        for(let i in arr) {
            if(arr[i] != undefined) {
                newarr.push(arr[i]);
            }
        }

        return newarr;
    }

    public static objectsCompare(obj1: any, obj2: any): boolean {
        if(!(typeof obj1 === "object" && typeof obj2 === "object")) return false;
        if(this.objectLength(obj1) != this.objectLength(obj2)) return false;

        var isEqual = true;

        for(let i in obj1) {
            if(typeof obj1[i] == "object" && typeof obj2[i] == "object") {
                if(!this.objectsCompare(obj1[i], obj2[i])) isEqual = false;
                continue;
            }

            if(obj1[i] != obj2[i]) isEqual = false;
        }

        return isEqual;
    }

    public static objectLength(obj: any): number {
        var length = 0;
        
        for(let i in obj) {
            length++;
        }

        return length;
    }
}
