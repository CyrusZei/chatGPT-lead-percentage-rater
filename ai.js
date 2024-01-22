require("dotenv").config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = "https://lexai.openai.azure.com/";
const azureApiKey = process.env.AZURE_API_KEY;

class LeadFilterService {
  constructor(client, deploymentId) {
    this.client = client;
    this.deploymentId = deploymentId;
  }

  async getLeadScore(msgData) {
    try {
      const response = await this.client.getChatCompletions(
        this.deploymentId,
        msgData,
        {
          maxTokens: 7000,
          temperature: 0.1,
          functions: [
            {
              name: "leadRater",
              description:
                "Rate each lead in a percentage from 0% to 100%. Where 0% means a cold lead and 100% means a hot lead.",
              parameters: {
                type: "object",
                properties: {
                  percentage: {
                    type: "number",
                    description: "The lead in percentage number",
                  },
                },
                required: ["percentage"],
              },
            },
          ],
          function_call: "auto",
        }
      );

      return response.choices[0].message.functionCall.arguments;
    } catch (error) {
      console.error("Error getting lead score:", error);
      throw error;
    }
  }

  static parsePercentage(leadData) {
    try {
      const jsonData = JSON.parse(leadData);
      console.log("Lead Percentage:", jsonData.percentage);
    } catch (error) {
      console.error("Error parsing lead data:", error);
    }
  }
}

async function main() {
  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(azureApiKey)
  );
  const deploymentId = process.env.DEPLOYMENT_ID;
  const leadFilterService = new LeadFilterService(client, deploymentId);

  const msgData = [
    {
      role: "system",
      content:
        "You are a professional AI that will rate leads from 0% (cold lead) to 100% (hot lead). Only return a percentage on how good the lead is.",
    },
    {
      role: "user",
      content:
        // "I hope this message finds you well. I recently came across your listing for the 4-bedroom home in Maplewood Estates and I am extremely interested in learning more about this property. The photos and description suggest that it might be exactly what my family and I have been searching for – a blend of modern luxury and comfort in a serene neighborhood. The renovated kitchen and spacious master suite particularly caught our eye, as these are features we value highly in our search for a new home. Could you please provide additional details or arrange a viewing at your earliest convenience? We are very eager to explore the possibility of making this beautiful house our new home.",
        // "I hope this email finds you well. My name is [Prospective Buyer's Name], and I am currently exploring housing options in the [Your City/Region] area. While I am in the early stages of my search and still considering various neighborhoods and property types, I came across your listing in Maplewood Estates.At this point, I am gathering information and not yet ready to make any decisions. However, I would appreciate it if you could provide some additional details about the area and the type of properties available, including the 4-bedroom home you have listed. Understanding the market better will help me refine my search criteria.Thank you for your time, and I look forward to receiving the requested information.",
        // "Hello, my name is [Inquirer's Name]. I'm currently doing some very preliminary research on various real estate markets for a potential, but not imminent, relocation in the distant future. My plans are not definite, and I am in the earliest stage of considering different regions.At this time, I am not focused on specific properties or even specific areas, but rather on gaining a broad understanding of the real estate landscape. I happened to come across your contact details and thought to reach out.If it's not too much trouble, could you provide me with some high-level insights into the current trends in your real estate market? I'm just gathering basic data at this point, so there's no need for detailed information about specific listings.Thank you for any general information you can provide, and I apologize for the speculative nature of my inquiry.",
        // "Thank you for reaching out with information about real estate opportunities in your area. I must inform you that at this time, I am not interested in buying or investing in property. My current circumstances and plans do not align with real estate acquisition, and it's unlikely that this will change in the foreseeable future.",
        "I appreciate your contact and the information provided. Please understand that this is a definitive decision, and I would prefer not to receive further communications regarding property listings or investment opportunities.Thank you for your understanding and best of luck with your future clients.",
    },
  ];

  try {
    const leadData = await leadFilterService.getLeadScore(msgData);
    LeadFilterService.parsePercentage(leadData);
  } catch (error) {
    console.error("Failed to process lead filter:", error);
  }
}

main();
