
export const initialState = {
    dashboardReducer:{
		dashboardData: {},
		dashboardJson: {},
		profileData:{},
		loading: false,
		error: null
	},
    accountHomeReducer:{	
		accountHomeData: {},
		accountHomeJson: {},
		selectedUser:'',
		selectedTab:'',
		selectedCompany:'',
		operatorCompanyData: {},
		loading: false,
		error: null
	},
	taxFeesHomeReducer:{	
		taxFeesHomeData: {},
		taxFeesHomeJson: {},
		selectedUser:'',
		selectedTab:'',
		loading: false,
		error: null
	},
	taxHomeReducer:{	
		taxDetails: {},
		taxHomeJson: {},
		selectedCompany: "",
		loading: false,
		error: null
	},
	feeHomeReducer:{	
		feeDetails: {},
		feeHomeJson: {},
		loading: false,
		error: null
	},
	additionalServiceHomeReducer:{	
		additionalServiceDetails: {},
		additionalServiceHomeJson: {},
		selectedUser:'',
		selectedTab:'',
		loading: false,
		error: null
	},
	profileReducer:{	
		profileData: {},
		profileJson: {},
		selectedUser:'',
		selectedTab:'',
		loading: false,
		error: null
	},
	accountCompanyReducer:{	
		accountCompanyJson: {},
		accountCompanyData: {},
		loading: false,
		error: null
	},
	accountLocationReducer:{	
		accountLocationJson: {},
		accountLocationData: {},
		loading: false,
		error: null
	},
	userReducer:{	
		userData: {},
		userJson: {},
		loading: false,
		error: null
	},
	landingReducer:{	
		landingJson: {},
		loading: false,
		error: null
	},
	demoReducer:{	
		demoJson: {},
		loading: false,
		error: null
	},
	contactReducer:{	
		contactJson: {},
		loading: false,
		error: null
	},
	aboutReducer:{	
		aboutJson: {},
		loading: false,
		error: null
	},
	menubarReducer:{	
		menubarJson: {},
		loading: false,
		error: null
	},
	footerReducer:{	
		footerJson: {},
		loading: false,
		error: null
	},
	aircraftReducer:{	
		aircraftData: {},
		aircraftJson: {},
		loading: false,
		error: null
	},
	paymentReducer:{	
		paymentData: {},
		paymentJson: {},
		loading: false,
		error: null
	},
	documentReducer:{	
		documentData: {},
		documentJson: {},
		fileData:false,
		loading: false,
		error: null
	},
	notificationReducer:{
		notificationData:{},
		saveNotification:{},
		loading: false,
		error: null
	},
	enrollmentReducer:{
		enrollmentNewData:{},
		enrollmentPendingData:{},
		enrollmentCompleteData:{},
		onboardingView:"",
		loading: false,
		error: null
	},
	loginReducer:{
		loginData:{},
		loginDetais:{},
		loading: false,
		error: null,
		loginAccessLevel:[]
	},
	searchHomeReducer:{	
		searchHomeData: {},
		searchHomeJson: {},
		searchUserData: {},
		searchAircraftData: {},
		searchCompanyData: {},
		selectedUser:'',
		selectedTab:'',
		searchValue:'',
		loading: true,
		error: null
	},
	fuelPriceHomeReducer:{	
		fuelPriceHomeData: {},
		fuelPriceHomeJson: {},
		selectedUser:'',
		selectedFuelPriceTab:'',
		adNewFuelJson:{},
		fuelTireData:{},
		fuelActiveData:{},
		saveFuelData:{},
		getDefaultTireData:{},
		fuelArchiveData:{},
		selectedCompany:{},
		selectedFuelData:{},
		loading: false,
		error: null
	},
	discountReducer:{
		discountData: {},
		discountJson: {},
		loading: false,
		error: null,
		bulkUploadJson:{},
		bulkUploadData:{}
	},
	commonReducer:{
		enableModal:false,
		loggedInUser:'',
		loggedInUserType:'',
		loggedInCompany:'',
		loggedInFirstName:'',
		mobileHeaderText:'',
		mobileFavoriteFbo:false,
		clientScreen:false
	},
	searchFuelOrderReducer:{
		searchFuelOrderJson:{},
		searchFuelOrderData:{},
		searchFuelResult: {},
		prefferedFboResult: {},
		orderDetails: {},
		orderMobileDetails:{},
		loading: false,
		error: null
	},
	orderPlacementReducer:{
		loading: false,
		error: null,
		orderPlacementJson: {},
		isMultileg:false,
		orderedData:{},
		orderID:"",
		legLevel:0,
		multiLegData:{},
		multipleLeg:false,
		isSummary:false,
		isReorder:false,
		isEditSingle:false,
		isEditMultiple:false,
		isOrderAccept:false,
		isOrderClose:false,
		isPreviousScreen:'',
		isMultiSummary:false,
		fromLocation:"",
		isPricePending:"",
		fuelInfo:{},
		clearAll:false,
		isMultiLedPricePending:""
	},
	orderPlacementDataReducer:{
		loading: false,
		error: null,
		orderPlacementDataJson: {},
	},
	orderPlacementSummaryReducer:{
		loading: false,
		error: null,
		orderPlacementSummaryJson: {}
	},
	orderViewDataReducer:{
		loading: false,
		error: null,
		orderviewJson: {}
	},
	orderViewHomeReducer:{
		loading: false,
		error: null,
		orderviewHomeJson: {},
		isClickViewOrder:false
	},
	multiLegReducer:{
		loading: false,
		error: null,
		multiLegJson: {},
		editLegData:{},
		isEdit:false
	},
	multiLegSummaryReducer:{
		loading: false,
		error: null,
		multiLegSummaryJson: {}
	},
	disputeReducer:{
		disputeData: {},
		disputeOrder: {},
		viewScreen: false,
		invoiceScreen: false,
		prevScreen: '',
		DispData:{},
		ReviewScreen:null
	},
	orderCompletedReducer:{
		orderCompletedJson:{},
		orderCompletedData:{},
		isResolveDispute:false,
		searchValue:'',
		selectedTabOrder:'',
		isMinDate:'',
		isMaxDate:'',
		loading: false,
		error: null
	},
	orderActiveReducer:{
		orderActiveJson:{},
		orderActiveData:{},
		loading: false,
		error: null
	},	
	activeOrderReducer:{
		orderDates:{
			orderFromDate:'',
			orderToDate:''
		}
	},
	auditLogReducer:{
		auditLogSaveJson:{},
		auditLogJson:{},
		auditCatUserJson:{}
	},statisticsReducer:{
		loading: false,
		error: null,
		statisticsData: {}
	},
	AdminReducer:{
		selectedTabAdmin:"",
		isDeactivate:false,
		inactive:false,
		systemVariables:{}
	}
}