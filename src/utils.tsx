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
}
