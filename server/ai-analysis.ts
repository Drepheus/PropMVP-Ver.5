import OpenAI from "openai";
import { PropertyWithDetails } from "../shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIPropertyAnalysis {
  grade: string; // A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
  score: number; // 0-100
  summary: string;
  keyStrengths: string[];
  riskFactors: string[];
  recommendation: string;
  estimatedProfit: number;
  confidenceLevel: number; // 0-100
  marketPosition: "Excellent" | "Good" | "Average" | "Below Average" | "Poor";
  urgency: "Buy ASAP" | "Strong Consider" | "Evaluate Further" | "Proceed with Caution" | "Avoid";
}

export async function analyzePropertyWithAI(property: PropertyWithDetails): Promise<AIPropertyAnalysis> {
  try {
    const prompt = `
    As an expert real estate wholesaler and investor, analyze this property for investment potential and provide a comprehensive grading.

    PROPERTY DATA:
    Address: ${property.address}, ${property.city}, ${property.state} ${property.zipCode}
    Beds/Baths: ${property.beds}/${property.baths}
    Square Footage: ${property.sqft || 'N/A'}
    Lot Size: ${property.lotSize || 'N/A'}
    Year Built: ${property.yearBuilt || 'N/A'}
    Property Type: ${property.propertyType || 'N/A'}
    List Price: $${property.listPrice || 'N/A'}
    Last Sale Price: $${property.lastSalePrice || 'N/A'}
    Last Sale Date: ${property.lastSaleDate || 'N/A'}
    Days on Market: ${property.daysOnMarket || 'N/A'}
    Price per Sq Ft: $${property.pricePerSqft || 'N/A'}
    HOA Fees: $${property.hoaFees || 'N/A'}
    Has Pool: ${property.hasPool ? 'Yes' : 'No'}
    Parking: ${property.parking || 'N/A'}
    Listing Status: ${property.listingStatus || 'N/A'}

    COMPARABLE SALES:
    ${property.comparables.map(comp => 
      `- ${comp.address}: $${comp.salePrice} (${comp.sqft || 'N/A'} sq ft, sold ${comp.saleDate})`
    ).join('\n')}

    MARKET METRICS:
    Median Sale Price: $${property.marketMetrics?.medianSalePrice || 'N/A'}
    Average Days on Market: ${property.marketMetrics?.avgDaysOnMarket || 'N/A'}
    Average Price per Sq Ft: $${property.marketMetrics?.avgPricePerSqft || 'N/A'}
    Price Appreciation: ${property.marketMetrics?.priceAppreciation || 'N/A'}%

    Analyze this property for wholesaling/investment potential and provide a JSON response with:
    {
      "grade": "Letter grade from F to A+",
      "score": "Numerical score 0-100",
      "summary": "3-sentence executive summary",
      "keyStrengths": ["Array of 3-5 key strengths"],
      "riskFactors": ["Array of 3-5 risk factors"],
      "recommendation": "Detailed investment recommendation",
      "estimatedProfit": "Estimated profit potential in dollars",
      "confidenceLevel": "Confidence in analysis 0-100",
      "marketPosition": "Excellent|Good|Average|Below Average|Poor",
      "urgency": "Buy ASAP|Strong Consider|Evaluate Further|Proceed with Caution|Avoid"
    }

    Consider factors like:
    - Market value vs listing price (deal potential)
    - Rental income potential vs purchase price
    - Days on market (motivation level)
    - Comparable sales analysis
    - Location quality (schools, crime, walkability)
    - Property condition indicators
    - Market trends and inventory
    - Profit margins for wholesaling
    - Cash flow potential for buy-and-hold
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate wholesaler and investor with 20+ years of experience. Provide detailed, actionable analysis for property investment decisions. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and ensure all required fields
    return {
      grade: analysis.grade || 'C',
      score: Math.min(100, Math.max(0, analysis.score || 50)),
      summary: analysis.summary || 'Analysis completed with limited data.',
      keyStrengths: Array.isArray(analysis.keyStrengths) ? analysis.keyStrengths : ['Property analysis available'],
      riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : ['Standard market risks apply'],
      recommendation: analysis.recommendation || 'Further evaluation recommended.',
      estimatedProfit: Math.max(0, analysis.estimatedProfit || 0),
      confidenceLevel: Math.min(100, Math.max(0, analysis.confidenceLevel || 70)),
      marketPosition: analysis.marketPosition || 'Average',
      urgency: analysis.urgency || 'Evaluate Further'
    };

  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze property with AI. Please try again.');
  }
}