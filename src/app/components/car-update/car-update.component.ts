import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent implements OnInit {

  carUpdateForm: FormGroup;
   car: Car;
   brands: Brand[] = [];
   colors: Color[] = [];
   
  constructor(private formBuilder: FormBuilder,
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.getCarById(param['Id']);
   });
  }

  getCarById(Id: number) {
    this.carService.getCarById(Id).subscribe(response => {
       this.car = response.data;

       this.getBrands();
       this.getColors();
       this.createCarUpdateForm();
    });
 }

 getBrands() {
    this.brandService.getBrands().subscribe(response => {
       this.brands = response.data;
    });
 }

 getColors() {
    this.colorService.getColors().subscribe(response => {
       this.colors = response.data;
    });
 }

 createCarUpdateForm() {
    this.carUpdateForm = this.formBuilder.group({
       Id: [this.car.Id, Validators.required],
       brandName: [this.car.brandId, Validators.required],
       colorName: [this.car.colorId, Validators.required],
       dailyPrice: [this.car.dailyPrice, Validators.required],
       modelYear: [this.car.modelYear, Validators.required],
       description: [this.car.description, Validators.required]
    });
 }

 update() {
    let car: Car = Object.assign({}, this.carUpdateForm.value);

    car.brandId = Number(car.brandId);
    car.colorId = Number(car.colorId);
    car.modelYear = Number(car.modelYear);
    car.dailyPrice = Number(car.dailyPrice);

    if (!this.carUpdateForm.valid) {
       this.toastrService.warning('Lütfen boş bilgi bırakmayın', 'Dikkat');
       return;
    }

    this.carService.update(car).subscribe(responseSuccess => {
       return this.toastrService.success(responseSuccess.message, 'Başarılı');
    }, responseError => {
       if (responseError.error.ValidationErrors.length == 0) {
          this.toastrService.error(responseError.error.Message, responseError.error.StatusCode);
          return;
       }

       for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
          this.toastrService.error(
             responseError.error.ValidationErrors[i].ErrorMessage, 'Doğrulama Hatası'
          );
       }
    });
 }
}
