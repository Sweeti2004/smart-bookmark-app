import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { valid: false, message: 'Please enter a website address.' },
                { status: 400 }
            );
        }

        // validate syntax first
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { valid: false, message: 'This doesn\'t look like a valid link. Please check the spelling.' },
                { status: 400 }
            );
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok || (response.status >= 300 && response.status < 400)) {
                return NextResponse.json({ valid: true });
            } else {
                // Some servers return 405 Method Not Allowed for HEAD, try GET
                if (response.status === 405) {
                    const controllerGet = new AbortController();
                    const timeoutIdGet = setTimeout(() => controllerGet.abort(), 5000);
                    try {
                        const responseGet = await fetch(url, {
                            method: 'GET',
                            signal: controllerGet.signal,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                            }
                        });
                        clearTimeout(timeoutIdGet);
                        if (responseGet.ok) {
                            return NextResponse.json({ valid: true });
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                return NextResponse.json(
                    { valid: false, message: `This link seems broken (Error: ${response.status}).` },
                    { status: 200 } // Return 200 so fontend can handle the "invalid" logic gracefully
                );
            }
        } catch (error) {
            clearTimeout(timeoutId);
            return NextResponse.json(
                { valid: false, message: 'We couldn\'t find this website. It might be down or incorrect.' },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { valid: false, message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
