import {Injectable} from "@angular/core";

@Injectable()
export class DomTreeAttrFixer {

  // constructor() {
  // }

  public tt(el) {
    let dataVs = Array.from(el.attributes, (attr) => attr['name']).filter((attr) => attr.indexOf('_ng') > -1);

    function t(it) {
      if (it.firstElementChild) {
        t(it.firstElementChild);
      }

      dataVs.forEach(v => it.setAttribute(v, ''));

      while (it.nextElementSibling) {
        t(it.nextElementSibling);
        it = it.nextElementSibling;
      }
    }

    t(el);
  }

}
