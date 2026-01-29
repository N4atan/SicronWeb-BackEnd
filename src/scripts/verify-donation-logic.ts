
const BASE_URL = 'http://localhost:3000';

async function main() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'ariel@gmail.com',
                password: 'ariel24'
            })
        });

        if (!loginRes.ok) {
            let msg = `Login failed: ${loginRes.status} ${loginRes.statusText}`;
            try { msg += ` - ${await loginRes.text()}`; } catch { }
            throw new Error(msg);
        }

        // Capture cookies
        // set-cookie header might look like: "name=value; Path=/, name2=value2; Path=/"
        // fetch API (in Node/Undici) might return them merged or as array.
        // If we use headers.getSetCookie() (Node 18+) we get array. headers.get() returns joined string.

        let rawCookies: string[] = [];
        if (loginRes.headers.getSetCookie) {
            rawCookies = loginRes.headers.getSetCookie();
        } else {
            const h = loginRes.headers.get('set-cookie');
            if (h) rawCookies.push(h);
        }

        if (rawCookies.length === 0) {
            throw new Error('Login successful but no Set-Cookie header received.');
        }

        const cookies = rawCookies.map(c => c.split(';')[0]).join('; ');

        console.log('Login successful. Cookies acquired:', cookies);

        // Helper to fetch with cookies
        const fetchWithAuth = (url: string, opts: any = {}) => {
            const headers = opts.headers || {};
            headers['Cookie'] = cookies;
            return fetch(url, { ...opts, headers });
        };

        // 2. Find an NGO and a Product
        console.log('2. Finding NGO and Product...');

        const ngosRes = await fetchWithAuth(`${BASE_URL}/ngos`);

        if (!ngosRes.ok) throw new Error(`Failed to list NGOs: ${await ngosRes.text()}`);
        const ngosData: any = await ngosRes.json();
        const ngos = ngosData.ngos || [];

        if (ngos.length === 0) throw new Error('No NGOs found to test with.');

        // Look for an NGO that has products
        let targetNGO: any = null;
        let targetProduct: any = null;
        let initialQuantity = 0;

        for (const ngo of ngos) {
            const detailRes = await fetchWithAuth(`${BASE_URL}/ngos/${ngo.uuid}`);
            const detail = await detailRes.json();

            if (detail.products && detail.products.length > 0) {
                targetNGO = ngo;
                const item = detail.products[0];
                targetProduct = item.product;
                initialQuantity = Number(item.collected_quantity || 0);

                if (!targetProduct || !targetProduct.uuid) {
                    console.log('Skipping item with missing product ref', item);
                    continue;
                }
                break;
            }
        }

        if (!targetNGO || !targetProduct) {
            throw new Error('Could not find an NGO with product needs to test.');
        }

        console.log(`Targeting NGO: ${targetNGO.name} (${targetNGO.uuid})`);
        console.log(`Targeting Product: ${targetProduct.name} (${targetProduct.uuid})`);
        console.log(`Initial Collected Quantity: ${initialQuantity}`);

        // 3. Make Donation
        const donationAmount = 1;
        console.log(`3. donating ${donationAmount} unit...`);

        const donateRes = await fetchWithAuth(`${BASE_URL}/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ngo_uuid: targetNGO.uuid,
                items: [
                    { product_uuid: targetProduct.uuid, quantity: donationAmount }
                ],
                fileUrl: 'http://test.com/receipt.jpg'
            })
        });

        if (!donateRes.ok) {
            console.error('Request Body:', JSON.stringify({
                ngo_uuid: targetNGO.uuid,
                items: [
                    { product_uuid: targetProduct.uuid, quantity: donationAmount }
                ],
                fileUrl: 'http://test.com/receipt.jpg'
            }));
            throw new Error(`Donation failed: ${donateRes.status} ${donateRes.statusText} - "${await donateRes.text()}"`);
        }
        console.log('Donation successful.');

        // 4. Verify Update
        console.log('4. Verifying quantity update...');
        const verifyRes = await fetchWithAuth(`${BASE_URL}/ngos/${targetNGO.uuid}`);
        const verifyDetail = await verifyRes.json();
        const verifiedItem = verifyDetail.products.find((p: any) => p.product.uuid === targetProduct.uuid);

        const finalQuantity = Number(verifiedItem.collected_quantity);
        console.log(`Final Collected Quantity: ${finalQuantity}`);

        if (finalQuantity === initialQuantity + donationAmount) {
            console.log('✅ TEST PASSED: Quantity updated correctly!');
        } else {
            console.error('❌ TEST FAILED: Quantity mismatch!');
            console.error(`Expected: ${initialQuantity + donationAmount}, Got: ${finalQuantity}`);
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
}

main();
