import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import Client, TestCase
from rest_framework.test import APITestCase

from api.models import BensImateriais, BensImoveis, BensMoveis, BensSemoventes


class InventoryApiTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="test-password",
        )
        self.client.force_authenticate(user=self.admin)

    def test_create_generates_ids_for_every_inventory_type(self):
        cases = [
            (
                "/bens_moveis/",
                {
                    "numeroPatrimonio": "PAT-1000",
                    "descricao": "Notebook",
                    "localizacao": "Sala 1",
                    "estado": "bom",
                    "responsavel": "Coordenação",
                },
            ),
            (
                "/bens_imoveis/",
                {
                    "numeroPatrimonio": "PAT-2000",
                    "descricao": "Prédio principal",
                    "localizacao": "Unidade central",
                    "estado": "bom",
                    "responsavel": "Direção",
                },
            ),
            (
                "/bens_semoventes/",
                {
                    "numeroPatrimonio": "PAT-3000",
                    "descricao": "Animal de apoio",
                    "dataNascimento": "2020-05-10",
                    "estado": "bom",
                    "responsavel": "Zeladoria",
                },
            ),
            (
                "/bens_imateriais/",
                {
                    "numeroPatrimonio": "PAT-4000",
                    "descricao": "Acervo histórico",
                    "dataOrigem": "2020-05-10",
                    "autor": "Comunidade escolar",
                    "responsavel": "Direção",
                },
            ),
        ]

        for endpoint, payload in cases:
            with self.subTest(endpoint=endpoint):
                response = self.client.post(endpoint, payload, format="json")
                self.assertEqual(response.status_code, 201)
                self.assertGreater(response.data["id"], 0)
                self.assertEqual(
                    response.data["numeroPatrimonio"], payload["numeroPatrimonio"]
                )

    def test_update_and_delete_use_frontend_item_url(self):
        item = BensMoveis.objects.create(
            numeroPatrimonio="PAT-1001",
            descricao="Notebook antigo",
            localizacao="Sala 1",
            estado="regular",
            responsavel="Coordenação",
        )

        response = self.client.put(
            f"/bens_moveis/{item.pk}/",
            {
                "numeroPatrimonio": "PAT-1001",
                "descricao": "Notebook atualizado",
                "localizacao": "Sala 2",
                "estado": "bom",
                "responsavel": "Coordenação",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        item.refresh_from_db()
        self.assertEqual(item.descricao, "Notebook atualizado")
        self.assertEqual(item.localizacao, "Sala 2")

        response = self.client.delete(f"/bens_moveis/{item.pk}/")

        self.assertEqual(response.status_code, 204)
        self.assertFalse(BensMoveis.objects.filter(pk=item.pk).exists())

    def test_model_permissions_allow_assigned_inventory_user(self):
        user = get_user_model().objects.create_user(
            username="operador",
            email="operador@example.com",
            password="test-password",
        )
        permissions = Permission.objects.filter(
            content_type__app_label="api",
            codename__in=["view_bensmoveis", "add_bensmoveis"],
        )
        user.user_permissions.add(*permissions)
        self.client.force_authenticate(user=user)

        list_response = self.client.get("/bens_moveis/")
        create_response = self.client.post(
            "/bens_moveis/",
            {
                "numeroPatrimonio": "PAT-1002",
                "descricao": "Projetor",
                "localizacao": "Sala 2",
                "estado": "bom",
                "responsavel": "Coordenação",
            },
            format="json",
        )

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(create_response.status_code, 201)

    def test_regular_user_cannot_write_inventory_or_manage_users(self):
        user = get_user_model().objects.create_user(
            username="visitante",
            email="visitante@example.com",
            password="test-password",
        )
        self.client.force_authenticate(user=user)

        inventory_response = self.client.post(
            "/bens_moveis/",
            {
                "numeroPatrimonio": "PAT-1003",
                "descricao": "Projetor",
                "localizacao": "Sala 2",
                "estado": "bom",
                "responsavel": "Coordenação",
            },
            format="json",
        )
        users_response = self.client.get("/users/")
        groups_response = self.client.get("/groups/")

        self.assertEqual(inventory_response.status_code, 403)
        self.assertEqual(users_response.status_code, 403)
        self.assertEqual(groups_response.status_code, 403)

class AllauthBrowserLoginTests(TestCase):
    def test_browser_login_session_and_logout(self):
        get_user_model().objects.create_user(
            username="login-user",
            email="login@example.com",
            password="test-password",
        )
        client = Client(enforce_csrf_checks=True)

        config_response = client.get("/_allauth/browser/v1/config")
        self.assertEqual(config_response.status_code, 200)
        self.assertIn("csrftoken", client.cookies)

        login_response = client.post(
            "/_allauth/browser/v1/auth/login",
            data=json.dumps(
                {"username": "login-user", "password": "test-password"}
            ),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value,
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertTrue(login_response.json()["meta"]["is_authenticated"])

        session_response = client.get("/_allauth/browser/v1/auth/session")
        self.assertTrue(session_response.json()["meta"]["is_authenticated"])

        logout_response = client.delete(
            "/_allauth/browser/v1/auth/session",
            HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value,
        )
        self.assertEqual(logout_response.status_code, 401)
        self.assertFalse(logout_response.json()["meta"]["is_authenticated"])
