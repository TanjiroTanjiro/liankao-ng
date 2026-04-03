import * as cheerio from 'cheerio';
import { fetchHtml } from './fetch';  
import { randomId } from 'elysia/dist/utils';

export async function getUserRealname(xstoken: string) {
    const webInfo=await fetchHtml("http://xsy.gdgzez.com.cn/JudgeOnline/modifypage.php",xstoken);
    const nameSelector = '#wrapper > div.form-container > form > div:nth-child(5) > p:nth-child(3)';
    const $ = cheerio.load(webInfo);
    // console.log(webInfo);
    const realname=$(nameSelector).text().trim();
    // console.log(realname);
    if(realname.length == 0)    throw Error("Failed to get name");
    return realname;
}