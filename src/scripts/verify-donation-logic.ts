
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

        // 3. Make Donation Logic (Normal + Overflow)

        const remaining = Number(targetProduct.quantity || 0) - initialQuantity;
        console.log(`Remaining quantity: ${remaining}`);

        if (remaining <= 0) {
            console.log('Goal already reached. Testing overflow directly...');
        } else {
            console.log(`Testing normal donation of 1 unit...`);
            const donateRes = await fetchWithAuth(`${BASE_URL}/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ngo_uuid: targetNGO.uuid,
                    items: [
                        { product_uuid: targetProduct.uuid, quantity: 1 }
                    ],
                    fileUrl: 'http://test.com/receipt.jpg'
                })
            });
            if (!donateRes.ok) throw new Error(`Normal donation failed: ${donateRes.status}`);
            console.log('Normal donation successful.');
        }

        // 4. Verify Overflow
        console.log('4. Testing Overflow (Donating Remaining + 10)...');
        const overflowQty = 10000;

        const failRes = await fetchWithAuth(`${BASE_URL}/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ngo_uuid: targetNGO.uuid,
                items: [
                    { product_uuid: targetProduct.uuid, quantity: overflowQty }
                ],
                fileUrl: 'http://test.com/receipt.jpg'
            })
        });

        if (failRes.status === 400) {
            console.log('✅ TEST PASSED: Overflow rejected with 400!');
            const err = await failRes.json();
            console.log('Error message received:', err.message);
        } else {
            console.error(`❌ TEST FAILED: Expected 400, got ${failRes.status}`);
            console.error(await failRes.text());
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
}

main();
