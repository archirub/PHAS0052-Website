import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-para',
  templateUrl: './para.component.html',
  styleUrls: ['./para.component.scss'],
})
export class ParaComponent implements OnInit, AfterViewInit {
  L_e = '$L_e$';
  L_mu = '$L_{\\mu}$';
  L_tau = '$L_{\\tau}$';
  MuToEGamma = '$\\mu \\rightarrow e \\gamma$';
  MuNToEN = '$\\mu N \\rightarrow e N$';
  MuTo3E = '$\\mu \\rightarrow 3 e$';
  MuToEEE = '$\\mu^+ \\rightarrow 3 e^+ e^- e^+$';
  lessThan10E16 = '$< 10^{-16}$';
  _10E4 = '$10^{4}$';
  _10E16 = '$10^{16}$';
  moreThan10E9 = '$> 10^{9}$';
  ZToEE = '$Z \\rightarrow e e$';
  ZToMuMu = '$Z \\rightarrow \\mu \\mu$';
  ZToEMu = '$Z \\rightarrow e \\mu$';

  @ViewChild('body') body: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.body) {
      // makes the equations inline
      Array.from(this.body.nativeElement.children).forEach((firstChild) => {
        Array.from((firstChild as any).children).forEach((secondChild) => {
          this.renderer.setStyle(secondChild, 'display', 'inline-block');
        });
      });
    }
  }
}
