
import requests
from typing import Optional, List, Dict, Any

API_KEY = "SG_APIM_RXV2HTA2168ET0BQDBS8CTATBZ71QXFC6S0X1ANGCJ0R5020WDDG"
BASE_URL = "https://api.sallinggroup.com/v1/food-waste"


class SallingFoodWasteAPI:
    """Wrapper for Salling Group Food Waste API"""

    def __init__(self, api_key: str = API_KEY):
        self.api_key = api_key
        self.base_url = BASE_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}'
        }

    def get_by_zip(self, zip_code: str) -> List[Dict[str, Any]]:
        """
        Get food waste items by zip code.

        Args:
            zip_code: Danish zip code (e.g., "8000")

        Returns:
            List of stores with their clearance items
        """
        params = {'zip': zip_code}
        response = requests.get(self.base_url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()

    def get_by_geolocation(self, latitude: float, longitude: float, radius: Optional[float] = None) -> List[Dict[str, Any]]:
        """
        Get food waste items by coordinates.

        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            radius: Search radius in kilometers (optional)

        Returns:
            List of stores with their clearance items (max 20 stores)
        """
        geo_string = f"{latitude},{longitude}"
        params = {'geo': geo_string}

        if radius is not None:
            params['radius'] = radius

        response = requests.get(self.base_url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()

    def get_by_store_id(self, store_id: str) -> Dict[str, Any]:
        """
        Get food waste items for a specific store.

        Args:
            store_id: Store ID (can be obtained from stores API)

        Returns:
            Store information with clearance items
        """
        url = f"{self.base_url}/{store_id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_all_clearances(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract all clearance items from API response.

        Args:
            data: Response from get_by_zip or get_by_geolocation

        Returns:
            List of all clearance items with store info
        """
        all_items = []
        for store_data in data:
            store_info = store_data.get('store', {})
            for clearance in store_data.get('clearances', []):
                item = {
                    'store_name': store_info.get('name'),
                    'store_brand': store_info.get('brand'),
                    'store_address': store_info.get('address'),
                    'product': clearance.get('product', {}),
                    'offer': clearance.get('offer', {})
                }
                all_items.append(item)
        return all_items


def main():
    """Example usage"""
    api = SallingFoodWasteAPI()

    # Example 1: Get by zip code
    print("=== Food Waste by Zip Code (1560) ===")
    try:
        results = api.get_by_zip("1560")
        print(f"Found {len(results)} stores with clearances")

        for store_data in results[:1]:  # Show first 1 store
            store = store_data['store']
            clearances = store_data['clearances']
            print(f"\n{store['name']} ({store['brand']})")
            print(f"Address: {store['address']['street']}, {store['address']['city']}")
            print(f"Clearance items: {len(clearances)}")

            for clearance in clearances:  # Show all items
                product = clearance['product']
                offer = clearance['offer']
                print(f"  - {product['description']}")
                print(f"    {offer['originalPrice']} → {offer['newPrice']} {offer['currency']} ({offer['percentDiscount']:.1f}% off)")
                print(f"    Stock: {offer['stock']} {offer['stockUnit']}")
            print("\n---")
            print(f"Total clearance items in store: {len(clearances)}")
    except Exception as e:
        print(f"Error: {e}")

    # Example 2: Get by geolocation
    print("\n\n=== Food Waste by Geolocation ===")
    try:
        # Coordinates for Aarhus, Denmark
        results = api.get_by_geolocation(56.154459, 10.206777, radius=5)
        print(f"Found {len(results)} stores within 5km")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
