import { Component, input, model, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-switch-btn',
  imports: [],
  templateUrl: './switch-btn.html',
  styleUrl: './switch-btn.css'
})
export class SwitchBtn {

  value = model<boolean>(false);
  switchValue: boolean = false;

  off_text = input<string>("OFF");
  onn_text = input<string>("ON");

  constructor() { }

  ngOnInit() {
    this.switchValue = this.value();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'])
      this.switchValue = this.value();
  }

    toggleSwitch(){
    if(this.switchValue)
      this.switchValue=false;
    else
      this.switchValue = true;

    this.value.update(() => this.switchValue);
  }

}
