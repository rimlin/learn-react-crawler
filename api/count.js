/*
import type { VercelRequest, VercelResponse } from '@vercel/node';

import sitesJson from '../data/sites.json' assert { type: 'json' };

const sites = sitesJson.sites;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    response.status(200).json({
      count: sites.length
    });
  } catch (err: any) {
    response.status(500).json({
      success: false,
      error: err.message || err
    });
  }
}
*/

const sitesJson = require('../data/sites.json');

const sites = sitesJson.sites;

module.exports = async (request, response) => {
  try {
    response.status(200).json({
      count: sites.length
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      error: err.message || err
    });
  }
};
