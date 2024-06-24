import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { interval, Observable, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

const IGNORE_FORCE_RATE_THRESHOLD = 2;

@Component({
  selector: 'converter',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
  form: FormGroup<{
    rate: FormControl<number>;
    forceRate: FormControl<number>;
    forceToggle: FormControl<boolean>;
    amount: FormControl<number>;
    startCurrency: FormControl<string>;
    targetCurrency: FormControl<string>;
    convertedValue: FormControl<number>;
  }>;
  rate$: Observable<number>;
  displayResult = false;
  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this._initForm();
    this._initLiveRate();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      rate: new FormControl<number>(1.1),
      forceRate: new FormControl<number>({ value: null, disabled: true }),
      forceToggle: new FormControl<boolean>(false),
      amount: new FormControl<number>(null),
      startCurrency: new FormControl<string>('Euro'),
      targetCurrency: new FormControl<string>('Dollar'),
      convertedValue: new FormControl<number>(null),
    });

    this.form.controls.forceToggle.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.controls.forceRate.enable();
        if (this.displayResult && this.form.controls.amount.value)
          this.convert();
      } else this.form.controls.forceRate.disable();
    });
  }

  private _initLiveRate() {
    interval(3000)
      .pipe(
        tap((_) => {
          const newRate = this._getRandomRate();
          this.form?.controls.rate.setValue(newRate);
          if (newRate >= IGNORE_FORCE_RATE_THRESHOLD)
            this.form.controls.forceToggle.setValue(false);
          if (this._shouldUpdateConvertedValue()) this.convert();
        })
      )
      .subscribe();
  }

  private _shouldUpdateConvertedValue(): boolean {
    return (
      this.displayResult &&
      this.form.controls.amount.value &&
      !this.form.controls.forceToggle.value
    );
  }

  private _getRandomRate(): number {
    const min = -0.05;
    const max = 0.05;
    const random = Math.random() * (max - min) + min;
    const newRate = 1.1 + random;
    return parseFloat(newRate.toFixed(2));
  }

  private _getRate(): number {
    if (this.form.controls.forceToggle.value)
      return this.form.controls.forceRate.value;
    const currentRate = this.form.controls.rate.value;
    return this.form.controls.targetCurrency.value === 'Euro'
      ? currentRate
      : 1 / currentRate;
  }

  public toggleCurrency() {
    const startCurrency = this.form.controls.startCurrency.value;
    const targetCurrency = this.form.controls.targetCurrency.value;
    this.form.controls.startCurrency.setValue(targetCurrency);
    this.form.controls.targetCurrency.setValue(startCurrency);
    if (this._shouldUpdateConvertedValue()) this.convert();
  }

  public convert() {
    const rate = this._getRate();
    const convertedValue = this.form.controls.amount.value * rate;
    this.form.controls.convertedValue.setValue(convertedValue);
    this.displayResult = true;
  }
}
