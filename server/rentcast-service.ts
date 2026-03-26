import { PropertySearch, PropertyWithDetails } from "../shared/schema";

// Enhanced Rentcast API interfaces to capture more comprehensive data
interface RentcastPropertyDetails {
  // Address information
  formattedAddress?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  
  // Property specifications
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  yearBuilt?: number;
  propertyType?: string;
  lotSize?: number;
  lotSizeSquareFeet?: number;
  lotSizeAcres?: number;
  
  // Valuation data
  rent?: number;
  rentHigh?: number;
  rentLow?: number;
  avm?: number;
  avmHigh?: number;
  avmLow?: number;
  value?: number;
  valueHigh?: number;
  valueLow?: number;
  
  // Sale history
  lastSaleDate?: string;
  lastSalePrice?: number;
  
  // Additional fields for comprehensive analysis
  taxAssessment?: number;
  pricePerSquareFoot?: number;
  monthlyRent?: number;
  grossRentMultiplier?: number;
  capRate?: number;
  cashOnCashReturn?: number;
  
  // API status for tracking data authenticity
  apiStatus?: 'success' | 'no_key' | 'not_found' | 'unavailable';
  
  // Property condition and features
  condition?: string;
  heating?: string;
  cooling?: string;
  flooring?: string;
  garage?: boolean;
  pool?: boolean;
  fireplace?: boolean;
  
  // Financial data
  taxes?: number;
  insurance?: number;
  hoaFees?: number;
  
  // Owner information
  ownerName?: string;
  ownerOccupied?: boolean;
  
  // Market position
  daysOnMarket?: number;
  listingStatus?: string;
  priceHistory?: Array<{
    date: string;
    price: number;
    event: string;
  }>;
}

interface RentcastComparable {
  id: string;
  formattedAddress: string;
  address?: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  price: number;
  salePrice?: number;
  listingType: string;
  listedDate?: string;
  removedDate?: string;
  daysOnMarket?: number;
  distance: number;
  correlation: number;
}

interface RentcastMarketData {
  city: string;
  state: string;
  zipCode: string;
  medianRent: number;
  medianSalePrice: number;
  averageDaysOnMarket: number;
  priceAppreciation: number;
  rentAppreciation: number;
}

class RentcastService {
  private apiKey: string;
  private baseUrl = 'https://api.rentcast.io/v1';

  constructor() {
    this.apiKey = process.env.RENTCAST_API_KEY || '';
    if (!this.apiKey) {
      console.warn('RENTCAST_API_KEY not configured - API features will be limited');
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    console.log(`Making Rentcast API request to: ${endpoint}`);
    console.log(`Request URL: ${url.toString()}`);
    console.log(`API Key present: ${this.apiKey ? 'Yes' : 'No'}`);
    console.log(`API Key length: ${this.apiKey ? this.apiKey.length : 0}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'PropAnalyzed/1.0',
      },
    });

    console.log(`Rentcast API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Rentcast API error: ${response.status} - ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`Rentcast API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Rentcast API response received (first 500 chars):`, JSON.stringify(data, null, 2).substring(0, 500));
    console.log(`Full response keys:`, Object.keys(data || {}));
    return data;
  }

  // Enhanced address formatting for better API compatibility
  private formatAddressForAPI(address: string, city: string, state: string, zipCode?: string): string {
    // Clean and standardize address components
    const cleanAddress = address.trim();
    const cleanCity = city?.trim() || '';
    const cleanState = state?.trim() || '';
    const cleanZip = zipCode?.trim() || '';

    // Handle common abbreviations and expand them for better API matching
    let formattedAddress = cleanAddress;
    
    // Standardize street type abbreviations to full words for better matching
    formattedAddress = formattedAddress.replace(/\bCt\b/gi, 'Court');
    formattedAddress = formattedAddress.replace(/\bSt\b/gi, 'Street');
    formattedAddress = formattedAddress.replace(/\bAve\b/gi, 'Avenue');
    formattedAddress = formattedAddress.replace(/\bDr\b/gi, 'Drive');
    formattedAddress = formattedAddress.replace(/\bRd\b/gi, 'Road');
    formattedAddress = formattedAddress.replace(/\bBlvd\b/gi, 'Boulevard');
    formattedAddress = formattedAddress.replace(/\bLn\b/gi, 'Lane');
    formattedAddress = formattedAddress.replace(/\bPl\b/gi, 'Place');

    // Construct full address with proper formatting - only include non-empty components
    let fullAddress = formattedAddress;
    if (cleanCity) {
      fullAddress += `, ${cleanCity}`;
    }
    if (cleanState) {
      fullAddress += `, ${cleanState}`;
    }
    if (cleanZip) {
      fullAddress += ` ${cleanZip}`;
    }

    return fullAddress;
  }

  async getPropertyDetails(address: string, city: string, state: string, zipCode?: string): Promise<RentcastPropertyDetails> {
    if (!this.apiKey) {
      console.log('Rentcast API key not available - cannot fetch authentic property data');
      return {
        address: `${address}`,
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        apiStatus: 'no_key'
      };
    }

    // Use enhanced address formatting for better API success
    const fullAddress = this.formatAddressForAPI(address, city, state, zipCode);
    const params: Record<string, string> = {
      address: fullAddress,
    };

    console.log(`Enhanced Rentcast API request with formatted address: ${fullAddress}`);

    try {
      const result = await this.makeRequest<RentcastPropertyDetails>('/avm/value', params);
      console.log('Property details API returned:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.warn('Property details API failed, attempting rent estimate endpoint');
      try {
        const rentResult = await this.makeRequest<RentcastPropertyDetails>('/avm/rent/long-term', params);
        console.log('Rent estimate API returned:', JSON.stringify(rentResult, null, 2));
        return rentResult;
      } catch (rentError) {
        console.warn(`Both property APIs failed for address: ${fullAddress} - API cannot locate this property`);
        return {
          formattedAddress: fullAddress,
          addressLine1: address,
          city: city || '',
          state: state || '',
          zipCode: zipCode || '',
          apiStatus: 'not_found'
        };
      }
    }
  }

  async getComparables(address: string, city: string, state: string, zipCode?: string): Promise<RentcastComparable[]> {
    if (!this.apiKey) {
      console.log('Rentcast API key not available - no comparables data');
      return [];
    }

    const params: Record<string, string> = {
      address: `${address}, ${city}, ${state}${zipCode ? ' ' + zipCode : ''}`,
      compCount: '10',
    };

    try {
      const response = await this.makeRequest<RentcastComparable[]>('/avm/value/comparables', params);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('Comparables not found, returning empty array');
      return [];
    }
  }

  async getMarketData(city: string, state: string, zipCode?: string): Promise<RentcastMarketData> {
    if (!this.apiKey) {
      console.log('Rentcast API key not available - returning unavailable market data');
      return {
        city,
        state,
        zipCode: zipCode || '',
        medianRent: 0,
        medianSalePrice: 0,
        averageDaysOnMarket: 0,
        priceAppreciation: 0,
        rentAppreciation: 0,
      };
    }

    const params: Record<string, string> = {
      city,
      state,
    };
    
    if (zipCode) {
      params.zipCode = zipCode;
    }

    try {
      return await this.makeRequest<RentcastMarketData>('/markets/rent', params);
    } catch (error) {
      console.warn('Market data API call failed, returning unavailable data');
      return {
        city,
        state,
        zipCode: zipCode || '',
        medianRent: 0,
        medianSalePrice: 0,
        averageDaysOnMarket: 0,
        priceAppreciation: 0,
        rentAppreciation: 0,
      };
    }
  }

  // Convert Rentcast data to our internal format with comprehensive property details
  convertToPropertyWithDetails(
    rentcastProperty: RentcastPropertyDetails, 
    comparables: RentcastComparable[], 
    marketData: RentcastMarketData,
    propertyId: number
  ): Omit<PropertyWithDetails, 'id'> {
    console.log('Converting Rentcast property data:', JSON.stringify(rentcastProperty, null, 2));
    console.log('Converting Rentcast comparables:', JSON.stringify(comparables, null, 2));
    console.log('Converting Rentcast market data:', JSON.stringify(marketData, null, 2));

    // Enhanced lot size calculation from API data
    let lotSize = 'N/A';
    if (rentcastProperty.lotSizeAcres) {
      lotSize = `${rentcastProperty.lotSizeAcres.toFixed(2)} acres`;
    } else if (rentcastProperty.lotSizeSquareFeet) {
      lotSize = `${(rentcastProperty.lotSizeSquareFeet / 43560).toFixed(2)} acres`;
    }

    // Extract comprehensive property data from API response
    const listPrice = rentcastProperty.avm || rentcastProperty.value || 0;
    const sqft = rentcastProperty.squareFootage || 0;
    const beds = rentcastProperty.bedrooms || 0;
    const baths = rentcastProperty.bathrooms || 0;
    const yearBuilt = rentcastProperty.yearBuilt || 0;
    
    // Calculate accurate price per sqft
    const pricePerSqft = sqft > 0 && listPrice > 0 ? (listPrice / sqft).toFixed(0) : '0';
    
    // Extract property features
    const hasPool = rentcastProperty.pool || false;
    const hasGarage = rentcastProperty.garage !== undefined ? rentcastProperty.garage : false;
    const parkingInfo = hasGarage ? '2-car garage' : 'N/A';
    
    // HOA fees from API
    const hoaFees = rentcastProperty.hoaFees 
      ? rentcastProperty.hoaFees.toString() 
      : '0.00';

    // Determine accurate listing status
    let listingStatus = 'For Sale';
    if (rentcastProperty.listingStatus) {
      listingStatus = rentcastProperty.listingStatus;
    } else if (listPrice > 0) {
      listingStatus = 'Property Valued';
    } else {
      listingStatus = 'Data Available';
    }

    // Owner & Intelligence Logic
    const ownerName = rentcastProperty.ownerName || 'Unknown Owner';
    const ownerOccupied = rentcastProperty.ownerOccupied !== undefined ? rentcastProperty.ownerOccupied : true;
    
    // Identify Investor (LLC, Corp, etc.)
    const investorPattern = /\b(LLC|Corp|Inc|Trust|Holdings|Partners|Management|Associates|Company|Co)\b/i;
    const investorType = investorPattern.test(ownerName) ? 'Investor (Entity)' : 'Individual';

    // Equity calculation
    const estimatedValue = listPrice;
    const lastSalePrice = parseFloat(rentcastProperty.lastSalePrice?.toString() || '0');
    const equity = estimatedValue > 0 ? (estimatedValue - lastSalePrice) : 0;
    const equityPercent = estimatedValue > 0 ? Math.round((equity / estimatedValue) * 100) : 0;

    // Enhanced property details using authentic Rentcast data or enhanced details
    return {
      address: rentcastProperty.formattedAddress || rentcastProperty.addressLine1 || rentcastProperty.address || 'Address Not Available',
      city: rentcastProperty.city || 'Unknown City',
      state: rentcastProperty.state || 'Unknown State', 
      zipCode: rentcastProperty.zipCode || 'N/A',
      beds: beds,
      baths: baths > 0 ? baths.toString() : '0.0',
      sqft: sqft,
      yearBuilt: yearBuilt,
      propertyType: rentcastProperty.propertyType || 'Single Family',
      lotSize: lotSize,
      parking: parkingInfo,
      hasPool: hasPool,
      hoaFees: hoaFees,
      listPrice: listPrice > 0 ? listPrice.toString() : '0',
      listingStatus: listingStatus,
      daysOnMarket: rentcastProperty.daysOnMarket || marketData.averageDaysOnMarket || 0,
      pricePerSqft: pricePerSqft,
      lastSalePrice: lastSalePrice.toString(),
      lastSaleDate: rentcastProperty.lastSaleDate || 'N/A',
      createdAt: new Date(),
      
      // New Intelligence fields
      ownerName,
      ownerOccupied,
      investorType,
      equity: equity.toString(),
      equityPercent,
      estimatedValue: estimatedValue.toString(),
      liens: '0.00', // Default if not found
      isListed: listingStatus === 'For Sale' || listingStatus === 'Active',
      listingHistory: rentcastProperty.priceHistory || [],

      // Enhanced comparable sales with accurate Rentcast data
      comparables: comparables.map(comp => {
        const salePrice = comp.price || 0;
        const sqft = comp.squareFootage || 1;
        const pricePerSqft = sqft > 0 && salePrice > 0 ? (salePrice / sqft).toFixed(0) : '0';
        
        return {
          id: 0,
          propertyId,
          address: comp.formattedAddress || 'Address Not Available',
          salePrice: salePrice.toString(),
          beds: comp.bedrooms || 0,
          baths: (comp.bathrooms || 0).toString(),
          sqft: comp.squareFootage || 0,
          pricePerSqft: pricePerSqft,
          saleDate: comp.removedDate ? new Date(comp.removedDate).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }) : 'Recent',
        };
      }),
      
      // Enhanced market metrics with authentic data
      marketMetrics: {
        id: 0,
        propertyId,
        avgDaysOnMarket: marketData.averageDaysOnMarket || 30,
        medianSalePrice: (marketData.medianSalePrice || 0).toString(),
        avgPricePerSqft: marketData.medianSalePrice && sqft > 0 
          ? (marketData.medianSalePrice / sqft).toFixed(0) 
          : pricePerSqft,
        priceAppreciation: marketData.priceAppreciation 
          ? marketData.priceAppreciation.toFixed(1) 
          : '0.0',
      }
    };
  }
}

export const rentcastService = new RentcastService();