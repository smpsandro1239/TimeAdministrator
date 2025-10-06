# Fix Errors in TimeAdministrator Frontend

## Issues Identified
1. **reports-simple.component.ts**: TypeError - Cannot read properties of undefined (reading 'nativeElement') at line 814 in createRevenueChart()
   - ViewChild for canvas is undefined because canvas is inside *ngIf="!loading", and initCharts is called before loading=false.

2. **subscription-details-dialog.component.ts**: TypeError - Cannot read properties of undefined (reading 'getTime') at line 564 in getExpiryClass()
   - data.endDate is undefined because not passed in dialog data.

## Tasks
- [ ] Fix canvas ViewChild initialization in reports-simple.component.ts
- [ ] Add null checks in chart creation methods
- [ ] Provide endDate in subscription details dialog data
- [ ] Add null check in getExpiryClass method
- [ ] Test the fixes by running the app
